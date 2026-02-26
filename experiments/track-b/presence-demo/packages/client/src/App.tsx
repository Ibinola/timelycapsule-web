import { useEffect, useMemo, useRef, useState } from "react";
import type { PresenceEvent, ServerMessage, SnapshotPayload } from "./types";

type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

type JoinForm = {
  userId: string;
  displayName: string;
  workspaceId: string;
  channelId: string;
};

const WS_URL =
  import.meta.env.VITE_PRESENCE_WS_URL ?? "ws://localhost:4301/ws";
const HEARTBEAT_MS = 10_000;

const initialForm: JoinForm = {
  userId: `user-${Math.floor(Math.random() * 9999)}`,
  displayName: "Demo User",
  workspaceId: "workspace-demo",
  channelId: "general",
};

const emptySnapshot: SnapshotPayload = {
  userCount: 0,
  users: [],
  recentEvents: [],
  serverTime: new Date().toISOString(),
};

const eventLabel: Record<PresenceEvent["type"], string> = {
  join: "JOIN",
  leave: "LEAVE",
  timeout: "TIMEOUT",
  replaced: "REPLACED",
};

const formatAt = (iso: string): string =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));

export function App() {
  const [form, setForm] = useState<JoinForm>(initialForm);
  const [status, setStatus] = useState<ConnectionState>("disconnected");
  const [lastError, setLastError] = useState<string>("");
  const [snapshot, setSnapshot] = useState<SnapshotPayload>(emptySnapshot);
  const [lastEvent, setLastEvent] = useState<PresenceEvent | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);
  const manualDisconnectRef = useRef(true);
  const joinFormRef = useRef(form);

  useEffect(() => {
    joinFormRef.current = form;
  }, [form]);

  const clearTimers = () => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (heartbeatTimerRef.current !== null) {
      window.clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  };

  const sendJson = (message: object) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    socket.send(JSON.stringify(message));
  };

  const startHeartbeatLoop = () => {
    if (heartbeatTimerRef.current !== null) {
      window.clearInterval(heartbeatTimerRef.current);
    }

    heartbeatTimerRef.current = window.setInterval(() => {
      sendJson({ type: "heartbeat" });
    }, HEARTBEAT_MS);
  };

  const scheduleReconnect = () => {
    if (manualDisconnectRef.current) {
      return;
    }
    const attempt = reconnectAttemptRef.current + 1;
    reconnectAttemptRef.current = attempt;
    const backoffMs = Math.min(10_000, 700 * 2 ** (attempt - 1));
    setStatus("reconnecting");

    reconnectTimerRef.current = window.setTimeout(() => {
      connectSocket(true);
    }, backoffMs);
  };

  const handleServerMessage = (raw: string) => {
    try {
      const message = JSON.parse(raw) as ServerMessage;
      if (message.type === "presence_snapshot") {
        setSnapshot(message.payload);
        return;
      }

      if (message.type === "presence_event") {
        setLastEvent(message.payload);
        return;
      }

      if (message.type === "presence_error") {
        setLastError(message.payload.message);
      }
    } catch {
      setLastError("Failed to parse server payload.");
    }
  };

  const connectSocket = (isReconnect = false) => {
    clearTimers();
    setLastError("");
    setStatus(isReconnect ? "reconnecting" : "connecting");

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      if (socketRef.current !== socket) return;
      reconnectAttemptRef.current = 0;
      setStatus("connected");
      sendJson({
        type: "join",
        payload: joinFormRef.current,
      });
      startHeartbeatLoop();
    };

    socket.onmessage = (event) => {
      if (socketRef.current !== socket) return;
      handleServerMessage(String(event.data));
    };

    socket.onclose = () => {
      if (socketRef.current !== socket) return;
      clearTimers();
      socketRef.current = null;

      if (manualDisconnectRef.current) {
        setStatus("disconnected");
      } else {
        scheduleReconnect();
      }
    };

    socket.onerror = () => {
      if (socketRef.current !== socket) return;
      setLastError("WebSocket error occurred.");
    };
  };

  const disconnectSocket = () => {
    manualDisconnectRef.current = true;
    clearTimers();

    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "leave" }));
      socket.close(1000, "manual disconnect");
    } else if (socket) {
      socket.close();
    }

    socketRef.current = null;
    setStatus("disconnected");
  };

  useEffect(() => () => disconnectSocket(), []);

  const groupedUsers = useMemo(() => {
    const group = new Map<string, number>();
    snapshot.users.forEach((user) => {
      const key = `${user.workspaceId}/${user.channelId}`;
      group.set(key, (group.get(key) ?? 0) + 1);
    });
    return [...group.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [snapshot.users]);

  return (
    <div className="layout">
      <header>
        <h1>Real-Time Presence Demo</h1>
        <p>
          Standalone WebSocket sandbox with heartbeat timeout cleanup and
          reconnect handling.
        </p>
      </header>

      <section className="card">
        <h2>Connection</h2>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            manualDisconnectRef.current = false;
            reconnectAttemptRef.current = 0;
            connectSocket(false);
          }}
        >
          <label>
            User ID
            <input
              value={form.userId}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, userId: event.target.value }))
              }
            />
          </label>
          <label>
            Display Name
            <input
              value={form.displayName}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  displayName: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Workspace
            <input
              value={form.workspaceId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  workspaceId: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Channel
            <input
              value={form.channelId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  channelId: event.target.value,
                }))
              }
            />
          </label>

          <div className="actions">
            <button type="submit">Connect</button>
            <button
              type="button"
              className="secondary"
              onClick={disconnectSocket}
            >
              Disconnect
            </button>
          </div>
        </form>

        <div className="status-row">
          <span className={`badge ${status}`}>{status}</span>
          <span>WS URL: {WS_URL}</span>
          <span>Server time: {formatAt(snapshot.serverTime)}</span>
        </div>
        {lastError && <p className="error-text">{lastError}</p>}
        {lastEvent && (
          <p className="hint">
            Last event: {eventLabel[lastEvent.type]} for {lastEvent.displayName}
          </p>
        )}
      </section>

      <section className="grid">
        <article className="card">
          <h2>Online Users ({snapshot.userCount})</h2>
          {snapshot.users.length === 0 ? (
            <p className="hint">No active users yet.</p>
          ) : (
            <ul className="user-list">
              {snapshot.users.map((user) => (
                <li key={user.connectionId}>
                  <div>
                    <strong>{user.displayName}</strong>
                    <span>{user.userId}</span>
                  </div>
                  <div className="align-right">
                    <span>
                      {user.workspaceId}/{user.channelId}
                    </span>
                    <small>heartbeat {formatAt(user.lastHeartbeatAt)}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <h2>Workspace / Channel Counts</h2>
          {groupedUsers.length === 0 ? (
            <p className="hint">No groups yet.</p>
          ) : (
            <ul className="group-list">
              {groupedUsers.map(([key, count]) => (
                <li key={key}>
                  <span>{key}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="card">
        <h2>Recent Presence Events</h2>
        {snapshot.recentEvents.length === 0 ? (
          <p className="hint">No events yet.</p>
        ) : (
          <ul className="event-list">
            {snapshot.recentEvents.map((event) => (
              <li key={event.id}>
                <span className={`event-tag ${event.type}`}>
                  {eventLabel[event.type]}
                </span>
                <span>
                  {event.displayName} ({event.userId}) in {event.workspaceId}/
                  {event.channelId}
                </span>
                <span>{formatAt(event.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
