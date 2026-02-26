import crypto from "node:crypto";
import http from "node:http";
import cors from "cors";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import type {
  ClientInboundMessage,
  EventMessage,
  PresenceEvent,
  PresenceEventType,
  PresenceUser,
  ServerOutboundMessage,
  SnapshotMessage,
} from "./types.js";

type ConnectionState = PresenceUser & {
  socket: WebSocket;
  lastHeartbeatMs: number;
};

const PORT = Number(process.env.PRESENCE_PORT ?? 4301);
const HEARTBEAT_SWEEP_MS = 5_000;
const CLIENT_TIMEOUT_MS = 30_000;
const MAX_RECENT_EVENTS = 40;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const connectionBySocket = new Map<WebSocket, ConnectionState>();
const socketByIdentity = new Map<string, WebSocket>();
const recentEvents: PresenceEvent[] = [];

const identityKey = (user: {
  workspaceId: string;
  channelId: string;
  userId: string;
}): string => `${user.workspaceId}::${user.channelId}::${user.userId}`;

const toPublicUser = (state: ConnectionState): PresenceUser => ({
  connectionId: state.connectionId,
  userId: state.userId,
  displayName: state.displayName,
  workspaceId: state.workspaceId,
  channelId: state.channelId,
  joinedAt: state.joinedAt,
  lastHeartbeatAt: state.lastHeartbeatAt,
});

const snapshotPayload = (): SnapshotMessage => {
  const users = [...connectionBySocket.values()]
    .map(toPublicUser)
    .sort((left, right) => left.joinedAt.localeCompare(right.joinedAt));

  return {
    type: "presence_snapshot",
    payload: {
      userCount: users.length,
      users,
      recentEvents: [...recentEvents].reverse(),
      serverTime: new Date().toISOString(),
    },
  };
};

const sendMessage = (socket: WebSocket, message: ServerOutboundMessage) => {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(message));
};

const broadcast = (message: ServerOutboundMessage) => {
  for (const client of wss.clients) {
    sendMessage(client, message);
  }
};

const addPresenceEvent = (
  type: PresenceEventType,
  state: ConnectionState,
  reason?: string,
): PresenceEvent => {
  const event: PresenceEvent = {
    id: crypto.randomUUID(),
    type,
    at: new Date().toISOString(),
    userId: state.userId,
    displayName: state.displayName,
    workspaceId: state.workspaceId,
    channelId: state.channelId,
    reason,
  };

  recentEvents.push(event);
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.splice(0, recentEvents.length - MAX_RECENT_EVENTS);
  }

  return event;
};

const broadcastEventAndSnapshot = (event: PresenceEvent) => {
  const eventMessage: EventMessage = {
    type: "presence_event",
    payload: event,
  };

  broadcast(eventMessage);
  broadcast(snapshotPayload());
};

const detachConnection = (
  socket: WebSocket,
  eventType: PresenceEventType,
  reason?: string,
) => {
  const current = connectionBySocket.get(socket);
  if (!current) return;

  connectionBySocket.delete(socket);
  const key = identityKey(current);
  if (socketByIdentity.get(key) === socket) {
    socketByIdentity.delete(key);
  }

  const event = addPresenceEvent(eventType, current, reason);
  broadcastEventAndSnapshot(event);
};

const validateJoinPayload = (rawPayload: unknown) => {
  if (!rawPayload || typeof rawPayload !== "object") {
    throw new Error("join payload must be an object");
  }

  const payload = rawPayload as Record<string, unknown>;
  const read = (key: string): string => {
    const value = payload[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`join payload field "${key}" is required`);
    }
    return value.trim();
  };

  return {
    userId: read("userId"),
    displayName: read("displayName"),
    workspaceId: read("workspaceId"),
    channelId: read("channelId"),
  };
};

const attachConnection = (socket: WebSocket, message: ClientInboundMessage) => {
  if (message.type !== "join") return;

  const payload = validateJoinPayload(message.payload);
  const key = identityKey(payload);
  const existingSocket = socketByIdentity.get(key);

  if (existingSocket && existingSocket !== socket) {
    detachConnection(existingSocket, "replaced", "connection replaced by reconnect");
    if (existingSocket.readyState === WebSocket.OPEN) {
      existingSocket.close(4002, "replaced");
    }
  }

  const nowMs = Date.now();
  const state: ConnectionState = {
    connectionId: crypto.randomUUID(),
    userId: payload.userId,
    displayName: payload.displayName,
    workspaceId: payload.workspaceId,
    channelId: payload.channelId,
    joinedAt: new Date(nowMs).toISOString(),
    lastHeartbeatAt: new Date(nowMs).toISOString(),
    lastHeartbeatMs: nowMs,
    socket,
  };

  connectionBySocket.set(socket, state);
  socketByIdentity.set(key, socket);

  const event = addPresenceEvent("join", state);
  broadcastEventAndSnapshot(event);
};

const handleClientMessage = (socket: WebSocket, raw: string) => {
  try {
    const parsed = JSON.parse(raw) as ClientInboundMessage;

    if (parsed.type === "join") {
      attachConnection(socket, parsed);
      return;
    }

    if (parsed.type === "heartbeat") {
      const state = connectionBySocket.get(socket);
      if (!state) return;
      const now = Date.now();
      state.lastHeartbeatMs = now;
      state.lastHeartbeatAt = new Date(now).toISOString();
      return;
    }

    if (parsed.type === "leave") {
      detachConnection(socket, "leave", "client requested leave");
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "leave");
      }
      return;
    }

    sendMessage(socket, {
      type: "presence_error",
      payload: { message: "Unknown message type" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid message";
    sendMessage(socket, {
      type: "presence_error",
      payload: { message },
    });
  }
};

wss.on("connection", (socket) => {
  sendMessage(socket, snapshotPayload());

  socket.on("message", (buffer) => {
    handleClientMessage(socket, buffer.toString("utf8"));
  });

  socket.on("close", () => {
    detachConnection(socket, "leave", "socket disconnected");
  });

  socket.on("error", () => {
    detachConnection(socket, "leave", "socket error");
  });
});

const timeoutSweep = setInterval(() => {
  const now = Date.now();
  for (const [socket, state] of connectionBySocket.entries()) {
    const elapsed = now - state.lastHeartbeatMs;
    if (elapsed > CLIENT_TIMEOUT_MS) {
      detachConnection(socket, "timeout", "heartbeat timeout");
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(4000, "heartbeat timeout");
      } else {
        socket.terminate();
      }
    }
  }
}, HEARTBEAT_SWEEP_MS);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "presence-server",
    timestamp: new Date().toISOString(),
  });
});

app.get("/presence", (_req, res) => {
  res.json(snapshotPayload().payload);
});

server.listen(PORT, () => {
  console.log(`[presence-server] running at http://localhost:${PORT}`);
  console.log(`[presence-server] websocket endpoint ws://localhost:${PORT}/ws`);
});

const shutdown = () => {
  clearInterval(timeoutSweep);
  wss.close();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
