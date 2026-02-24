import fs from "node:fs";
import { getRequestId } from "./requestContext.js";

export type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  event: string;
  [key: string]: unknown;
};

const logFilePath = process.env.LOG_FILE;
const appEnv = process.env.NODE_ENV ?? "development";

const emit = (line: string) => {
  if (logFilePath) {
    fs.appendFileSync(logFilePath, `${line}\n`, "utf8");
  }
  process.stdout.write(`${line}\n`);
};

export const log = (level: LogLevel, payload: LogPayload) => {
  const requestId = getRequestId();
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    requestId,
    ...payload,
  });
  emit(line);
};

export const logError = (payload: LogPayload, error: unknown) => {
  const base: Record<string, unknown> = {
    ...payload,
  };

  if (error instanceof Error) {
    base.errorName = error.name;
    base.errorMessage = error.message;
    if (appEnv !== "production") {
      base.errorStack = error.stack;
    }
  } else {
    base.errorMessage = String(error);
  }

  log("error", base);
};
