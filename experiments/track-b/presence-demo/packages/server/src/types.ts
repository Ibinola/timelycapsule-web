export type PresenceEventType = "join" | "leave" | "timeout" | "replaced";

export type PresenceUser = {
  connectionId: string;
  userId: string;
  displayName: string;
  workspaceId: string;
  channelId: string;
  joinedAt: string;
  lastHeartbeatAt: string;
};

export type PresenceEvent = {
  id: string;
  type: PresenceEventType;
  at: string;
  userId: string;
  displayName: string;
  workspaceId: string;
  channelId: string;
  reason?: string;
};

export type JoinMessage = {
  type: "join";
  payload: {
    userId: string;
    displayName: string;
    workspaceId: string;
    channelId: string;
  };
};

export type HeartbeatMessage = {
  type: "heartbeat";
};

export type LeaveMessage = {
  type: "leave";
};

export type ClientInboundMessage = JoinMessage | HeartbeatMessage | LeaveMessage;

export type SnapshotMessage = {
  type: "presence_snapshot";
  payload: {
    userCount: number;
    users: PresenceUser[];
    recentEvents: PresenceEvent[];
    serverTime: string;
  };
};

export type EventMessage = {
  type: "presence_event";
  payload: PresenceEvent;
};

export type ErrorMessage = {
  type: "presence_error";
  payload: {
    message: string;
  };
};

export type ServerOutboundMessage = SnapshotMessage | EventMessage | ErrorMessage;
