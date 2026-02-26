import fs from "node:fs/promises";
import path from "node:path";

type RequestEndLog = {
  event: "request_end";
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
};

const percentile = (samples: number[], p: number): number => {
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1),
  );
  return Number((sorted[index] ?? 0).toFixed(2));
};

const usage = `
Usage:
  pnpm parse -- --file <path-to-log-file>

Example:
  pnpm parse -- --file ./logs/app.log
`.trim();

const parseArgs = (argv: string[]) => {
  const fileArgIndex = argv.indexOf("--file");
  if (fileArgIndex === -1 || !argv[fileArgIndex + 1]) {
    throw new Error(`--file is required.\n\n${usage}`);
  }
  return {
    filePath: path.resolve(argv[fileArgIndex + 1]),
  };
};

const isRequestEndLog = (value: unknown): value is RequestEndLog => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RequestEndLog>;
  return (
    candidate.event === "request_end" &&
    typeof candidate.method === "string" &&
    typeof candidate.route === "string" &&
    typeof candidate.statusCode === "number" &&
    typeof candidate.durationMs === "number"
  );
};

const renderMarkdown = (
  grouped: Array<{
    key: string;
    count: number;
    avgMs: number;
    p95Ms: number;
    maxMs: number;
    errorRatePct: number;
  }>,
) =>
  [
    "# Route Latency Summary",
    "",
    "| Route Key | Count | Avg (ms) | P95 (ms) | Max (ms) | Error Rate (%) |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...grouped.map(
      (row) =>
        `| ${row.key} | ${row.count} | ${row.avgMs.toFixed(2)} | ${row.p95Ms.toFixed(2)} | ${row.maxMs.toFixed(2)} | ${row.errorRatePct.toFixed(2)} |`,
    ),
  ].join("\n");

const main = async () => {
  const { filePath } = parseArgs(process.argv.slice(2));
  const raw = await fs.readFile(filePath, "utf8");
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);

  const requestEndLogs: RequestEndLog[] = [];
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as unknown;
      if (isRequestEndLog(parsed)) {
        requestEndLogs.push(parsed);
      }
    } catch {
      // Ignore malformed lines to allow mixed log files.
    }
  }

  if (requestEndLogs.length === 0) {
    console.log("No request_end logs found.");
    return;
  }

  const groupedMap = new Map<
    string,
    { durations: number[]; total: number; errorCount: number }
  >();

  for (const log of requestEndLogs) {
    const key = `${log.method} ${log.route}`;
    const bucket = groupedMap.get(key) ?? { durations: [], total: 0, errorCount: 0 };
    bucket.durations.push(log.durationMs);
    bucket.total += 1;
    if (log.statusCode >= 400) {
      bucket.errorCount += 1;
    }
    groupedMap.set(key, bucket);
  }

  const grouped = [...groupedMap.entries()]
    .map(([key, bucket]) => {
      const sum = bucket.durations.reduce((acc, value) => acc + value, 0);
      const avgMs = sum / bucket.total;
      const maxMs = Math.max(...bucket.durations);
      const p95Ms = percentile(bucket.durations, 95);
      const errorRatePct = (bucket.errorCount / bucket.total) * 100;

      return {
        key,
        count: bucket.total,
        avgMs,
        p95Ms,
        maxMs,
        errorRatePct,
      };
    })
    .sort((a, b) => b.count - a.count);

  console.log(renderMarkdown(grouped));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[parse-logs] ${message}`);
  process.exit(1);
});
