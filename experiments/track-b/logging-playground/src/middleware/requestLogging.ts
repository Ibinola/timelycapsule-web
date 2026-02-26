import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { log } from "../logger.js";
import { runWithRequestContext } from "../requestContext.js";

const REQUEST_ID_HEADER = "x-request-id";

export const requestLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const externalRequestId = req.header(REQUEST_ID_HEADER);
  const requestId = externalRequestId && externalRequestId.trim() !== ""
    ? externalRequestId.trim()
    : crypto.randomUUID();
  const startNs = process.hrtime.bigint();

  res.setHeader(REQUEST_ID_HEADER, requestId);

  runWithRequestContext({ requestId }, () => {
    log("info", {
      event: "request_start",
      method: req.method,
      route: req.path,
      fullPath: req.originalUrl,
      ip: req.ip,
      userAgent: req.header("user-agent"),
    });

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startNs) / 1_000_000;
      const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

      log(level, {
        event: "request_end",
        method: req.method,
        route: req.path,
        fullPath: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
      });
    });

    next();
  });
};
