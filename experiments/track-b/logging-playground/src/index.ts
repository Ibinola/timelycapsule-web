import cors from "cors";
import express from "express";
import { log, logError } from "./logger.js";
import { requestLoggingMiddleware } from "./middleware/requestLogging.js";

const PORT = Number(process.env.LOGGING_PLAYGROUND_PORT ?? 4320);

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(requestLoggingMiddleware);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "logging-playground",
    timestamp: new Date().toISOString(),
  });
});

app.get("/demo/work", async (req, res) => {
  const delayRaw = req.query.delayMs;
  const delayMs =
    typeof delayRaw === "string" ? Math.max(0, Math.min(5000, Number(delayRaw))) : 120;

  await new Promise((resolve) => setTimeout(resolve, Number.isFinite(delayMs) ? delayMs : 120));

  // Async boundary logging demonstrates requestId propagation.
  log("info", {
    event: "domain_work_completed",
    route: req.path,
    delayMs: Number.isFinite(delayMs) ? delayMs : 120,
  });

  res.json({
    ok: true,
    delayMs: Number.isFinite(delayMs) ? delayMs : 120,
  });
});

app.get("/demo/warn", (_req, res) => {
  res.status(429).json({
    ok: false,
    message: "Synthetic rate-limit warning route",
  });
});

app.get("/demo/fail", () => {
  throw new Error("Synthetic failure from /demo/fail");
});

app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logError(
      {
        event: "request_exception",
        method: req.method,
        route: req.path,
        fullPath: req.originalUrl,
      },
      error,
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  },
);

app.listen(PORT, () => {
  log("info", {
    event: "server_started",
    port: PORT,
    env: process.env.NODE_ENV ?? "development",
    logFile: process.env.LOG_FILE ?? null,
  });
});
