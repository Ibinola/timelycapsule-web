# B-05 Real-Time Presence Demo

Standalone Express + WebSocket sandbox with a React client.

## Scope

- Isolated under `experiments/track-b/presence-demo`.
- No imports from main app paths.
- Safe to remove by deleting this folder.

## Features

- Presence events: `join`, `leave`, `timeout`.
- Online user count and user list by workspace/channel.
- Recent event feed (join/leave/timeout/reconnect replacement).
- Client heartbeat loop and server stale cleanup.
- Client auto-reconnect with backoff.

## Run

```bash
cd experiments/track-b/presence-demo
pnpm install
pnpm dev
```

Default URLs:

- Server: `http://localhost:4301`
- Client: `http://localhost:4310`

## Manual Test

1. Open two browser tabs to the client URL.
2. Join same workspace/channel with different users.
3. Verify user count increments and join events appear.
4. Close one tab and verify leave event appears.
5. Disable network on one tab for >30s and verify timeout event appears.
