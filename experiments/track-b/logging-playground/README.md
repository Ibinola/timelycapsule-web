# B-06 Structured Logging Playground

Standalone Express logging sandbox focused on correlation IDs and request lifecycle telemetry.

## Scope

- Isolated under `experiments/track-b/logging-playground`.
- No integration with OG app runtimes.
- Safe removal by deleting this folder.

## Features

- Structured JSON logs with levels: `info`, `warn`, `error`.
- Request correlation via `x-request-id` (incoming header or generated UUID).
- Request start/end logs with method, route, status code, and duration.
- Global exception handler logs stack traces in non-production mode.
- Async context propagation using `AsyncLocalStorage`.
- Log parser script that aggregates route-level latency and error rate.

## Run

```bash
cd experiments/track-b/logging-playground
pnpm install
pnpm dev
```

Server URL: `http://localhost:4320`

## Optional File Logging

```bash
LOG_FILE=./logs/app.log pnpm dev
```

## Demo Endpoints

- `GET /health`
- `GET /demo/work?delayMs=200`
- `GET /demo/warn`
- `GET /demo/fail`

## Parse Logs

```bash
pnpm parse -- --file ./logs/app.log
```

Outputs markdown table:

- request count per route
- avg latency
- p95 latency
- max latency
- error rate
