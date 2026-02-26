#!/usr/bin/env node

/**
 * Timezone Conversion Checker
 * Verifies scheduled message entries in schedules.json for:
 *  - Invalid IANA timezone labels
 *  - Ambiguous local times (DST fallback overlap)
 *  - Outputs normalized UTC timestamp per schedule
 */

const fs = require('fs');
const path = require('path');

// ─── ANSI colours ─────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  grey:   '\x1b[90m',
};

const tag = {
  ok:      `${c.green}${c.bold}  VALID  ${c.reset}`,
  warn:    `${c.yellow}${c.bold} WARNING ${c.reset}`,
  error:   `${c.red}${c.bold}  ERROR  ${c.reset}`,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the IANA timezone label is valid.
 * Uses Intl.DateTimeFormat — throws for unknown zones.
 */
function isValidIANA(timezone) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether a local datetime string is ambiguous in the given timezone.
 * Ambiguity occurs during DST "fall-back" when a wall-clock hour repeats.
 *
 * Strategy: resolve the local time to a UTC instant, then check if shifting
 * that UTC instant by -1 hour maps to the SAME local clock reading. If so,
 * the local time exists twice — it is ambiguous.
 */
function checkAmbiguous(localTime, timezone) {
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });

  const toLocal = (ms) => fmt.format(new Date(ms)).replace(' ', 'T');

  // Find the first UTC instant that produces this local time
  const utcStr = toUTC(localTime, timezone);
  if (!utcStr) return false;

  const utcMs = Date.parse(utcStr);
  const ONE_HOUR = 3600_000;

  // The binary search finds the earliest UTC instant. If shifting +1h still
  // produces the same local time, this time exists twice — ambiguous DST fold.
  const localAtPlus1h = toLocal(utcMs + ONE_HOUR);
  return localAtPlus1h === localTime;
}

/**
 * Convert a local datetime string to a UTC ISO string for the given timezone.
 * Returns null if the timezone is invalid.
 */
function toUTC(localTime, timezone) {
  if (!isValidIANA(timezone)) return null;

  // Luxon/moment are not available; use native Intl offset calculation.
  // Find the UTC offset the timezone applies to this local time by binary
  // searching for the UTC instant whose local representation matches localTime.

  const target = localTime.replace('T', ' '); // "YYYY-MM-DD HH:mm:ss"
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });

  // Seed: treat local time as UTC and offset by ±14h window
  const seed = Date.parse(localTime + 'Z');
  const MAX_OFFSET = 14 * 3600_000;

  let lo = seed - MAX_OFFSET;
  let hi = seed + MAX_OFFSET;

  // Binary search (converges in ~46 iterations for ms precision)
  for (let i = 0; i < 60; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const midLocal = fmt.format(new Date(mid)).replace(' ', 'T');
    if (midLocal < localTime) lo = mid + 1;
    else hi = mid;
  }

  // Validate result
  const found = fmt.format(new Date(lo)).replace(' ', 'T');
  if (found !== localTime) return null; // non-existent time (spring-forward gap)

  return new Date(lo).toISOString();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function run() {
  const inputPath = path.resolve(process.argv[2] || 'schedules.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`${c.red}File not found:${c.reset} ${inputPath}`);
    process.exit(1);
  }

  let schedules;
  try {
    schedules = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (e) {
    console.error(`${c.red}Failed to parse JSON:${c.reset} ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(schedules)) {
    console.error(`${c.red}Expected a JSON array in schedules.json${c.reset}`);
    process.exit(1);
  }

  console.log(`\n${c.bold}${c.cyan}━━━  Timezone Conversion Checker  ━━━${c.reset}`);
  console.log(`${c.grey}Input: ${inputPath}${c.reset}`);
  console.log(`${c.grey}Entries: ${schedules.length}${c.reset}\n`);

  const results = [];
  let errorCount = 0;
  let warnCount  = 0;

  for (const entry of schedules) {
    const { id, label, localTime, timezone } = entry;
    const result = { id, label, localTime, timezone, status: 'valid', utc: null, issues: [] };

    // 1. Validate IANA timezone
    if (!isValidIANA(timezone)) {
      result.status = 'error';
      result.issues.push(`Invalid IANA timezone: "${timezone}"`);
      errorCount++;
      results.push(result);
      continue;
    }

    // 2. Resolve UTC
    const utc = toUTC(localTime, timezone);
    if (!utc) {
      result.status = 'error';
      result.issues.push(`Non-existent local time (spring-forward gap): "${localTime}" in ${timezone}`);
      errorCount++;
      results.push(result);
      continue;
    }
    result.utc = utc;

    // 3. Check ambiguity
    if (checkAmbiguous(localTime, timezone)) {
      result.status = 'warning';
      result.issues.push(`Ambiguous local time — falls in DST fall-back overlap. UTC assumed: ${utc}`);
      warnCount++;
    }

    results.push(result);
  }

  // ─── Output table ────────────────────────────────────────────────────────
  for (const r of results) {
    const statusTag = r.status === 'valid' ? tag.ok : r.status === 'warning' ? tag.warn : tag.error;

    console.log(`${statusTag} ${c.bold}${r.id}${c.reset}  ${c.grey}${r.label}${c.reset}`);
    console.log(`         ${c.grey}Local :${c.reset} ${r.localTime}  ${c.grey}Zone:${c.reset} ${r.timezone}`);

    if (r.utc) {
      console.log(`         ${c.grey}UTC   :${c.reset} ${c.cyan}${r.utc}${c.reset}`);
    }

    for (const issue of r.issues) {
      console.log(`         ${c.yellow}⚠  ${issue}${c.reset}`);
    }

    console.log();
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log(`${c.bold}━━━  Summary  ━━━${c.reset}`);
  console.log(`  Total   : ${schedules.length}`);
  console.log(`  ${c.green}Valid   : ${schedules.length - errorCount - warnCount}${c.reset}`);
  console.log(`  ${c.yellow}Warnings: ${warnCount}${c.reset}`);
  console.log(`  ${c.red}Errors  : ${errorCount}${c.reset}\n`);

  // ─── Write JSON report ────────────────────────────────────────────────────
  const reportPath = path.resolve('timezone-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`${c.grey}Report saved to ${reportPath}${c.reset}\n`);

  process.exit(errorCount > 0 ? 1 : 0);
}

run();