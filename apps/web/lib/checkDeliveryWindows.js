#!/usr/bin/env node

/**
 * Delivery Window Validator
 * Validates delivery windows from input.json and outputs a human-readable report.
 *
 * Checks:
 *  - Missing or malformed dates
 *  - Window start in the past
 *  - Window start too soon (< 1h from now) — warning
 *  - End before start
 *  - Window shorter than 24 hours
 */

const fs   = require('fs');
const path = require('path');

// ─── ANSI colours ─────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  grey:   '\x1b[90m',
};

const tag = {
  valid:   `${c.green}${c.bold}  VALID  ${c.reset}`,
  warning: `${c.yellow}${c.bold} WARNING ${c.reset}`,
  invalid: `${c.red}${c.bold} INVALID ${c.reset}`,
};

// ─── Constants ────────────────────────────────────────────────────────────────
const MIN_WINDOW_MS  = 24 * 60 * 60 * 1000;   // 24 hours
const SOON_THRESHOLD = 60 * 60 * 1000;         // 1 hour — warn if start is within this

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseDate(value) {
  if (!value) return null;
  const ms = Date.parse(value);
  return isNaN(ms) ? null : new Date(ms);
}

function formatDate(date) {
  return date.toISOString().replace('T', ' ').replace('.000Z', ' UTC');
}

function humanDuration(ms) {
  const hours   = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 48) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0)   return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateEntry(entry, now) {
  const { id, label, windowStart, windowEnd } = entry;
  const issues   = [];
  const warnings = [];

  const start = parseDate(windowStart);
  const end   = parseDate(windowEnd);

  // 1. Malformed / missing dates
  if (!start) {
    issues.push(`Invalid or missing windowStart: "${windowStart}"`);
  }
  if (!end) {
    issues.push(`Invalid or missing windowEnd: "${windowEnd}"`);
  }

  // Can't do further checks without valid dates
  if (!start || !end) {
    return { id, label, status: 'invalid', issues, warnings, start, end, durationMs: null };
  }

  const durationMs = end - start;

  // 2. Start in the past
  if (start < now) {
    issues.push(`Window start is in the past (${formatDate(start)})`);
  }

  // 3. End before start
  if (end <= start) {
    issues.push(`Window end (${formatDate(end)}) is before or equal to start (${formatDate(start)})`);
  }

  // 4. Window shorter than 24h (only meaningful if end > start)
  if (end > start && durationMs < MIN_WINDOW_MS) {
    issues.push(`Window is too short: ${humanDuration(durationMs)} (minimum 24h required)`);
  }

  // 5. Warning: starts very soon (within 1h) but not in the past
  if (start >= now && (start - now) < SOON_THRESHOLD) {
    warnings.push(`Window starts very soon: in ${humanDuration(start - now)}`);
  }

  const status = issues.length > 0 ? 'invalid' : warnings.length > 0 ? 'warning' : 'valid';
  return { id, label, status, issues, warnings, start, end, durationMs };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function run() {
  const inputPath = path.resolve(process.argv[2] || 'input.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`${c.red}File not found:${c.reset} ${inputPath}`);
    process.exit(1);
  }

  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (e) {
    console.error(`${c.red}Failed to parse JSON:${c.reset} ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(entries)) {
    console.error(`${c.red}Expected a JSON array in input.json${c.reset}`);
    process.exit(1);
  }

  const now = new Date();

  console.log(`\n${c.bold}${c.cyan}━━━  Delivery Window Validator  ━━━${c.reset}`);
  console.log(`${c.grey}Input  : ${inputPath}${c.reset}`);
  console.log(`${c.grey}Now    : ${formatDate(now)}${c.reset}`);
  console.log(`${c.grey}Entries: ${entries.length}${c.reset}\n`);

  const results = entries.map((e) => validateEntry(e, now));

  // ─── Print each result ────────────────────────────────────────────────────
  for (const r of results) {
    const statusTag =
      r.status === 'valid'   ? tag.valid :
      r.status === 'warning' ? tag.warning :
                               tag.invalid;

    console.log(`${statusTag} ${c.bold}${r.id}${c.reset}  ${c.grey}${r.label}${c.reset}`);

    if (r.start && r.end && r.end > r.start) {
      console.log(
        `         ${c.grey}Start :${c.reset} ${formatDate(r.start)}  ` +
        `${c.grey}End:${c.reset} ${formatDate(r.end)}  ` +
        `${c.grey}Duration:${c.reset} ${c.cyan}${humanDuration(r.durationMs)}${c.reset}`
      );
    } else if (r.start) {
      console.log(`         ${c.grey}Start :${c.reset} ${formatDate(r.start)}`);
    }

    for (const issue of r.issues) {
      console.log(`         ${c.red}✖  ${issue}${c.reset}`);
    }
    for (const warn of r.warnings) {
      console.log(`         ${c.yellow}⚠  ${warn}${c.reset}`);
    }

    console.log();
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  const counts = results.reduce(
    (acc, r) => { acc[r.status]++; return acc; },
    { valid: 0, warning: 0, invalid: 0 }
  );

  console.log(`${c.bold}━━━  Summary  ━━━${c.reset}`);
  console.log(`  Total   : ${c.bold}${entries.length}${c.reset}`);
  console.log(`  ${c.green}Valid   : ${counts.valid}${c.reset}`);
  console.log(`  ${c.yellow}Warnings: ${counts.warning}${c.reset}`);
  console.log(`  ${c.red}Invalid : ${counts.invalid}${c.reset}\n`);

  // ─── JSON report ─────────────────────────────────────────────────────────
  const report = results.map(({ id, label, status, issues, warnings, start, end, durationMs }) => ({
    id,
    label,
    status,
    windowStart: start ? start.toISOString() : null,
    windowEnd:   end   ? end.toISOString()   : null,
    durationHours: durationMs ? +(durationMs / 3600000).toFixed(2) : null,
    issues,
    warnings,
  }));

  const reportPath = path.resolve('delivery-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`${c.grey}Report saved to ${reportPath}${c.reset}\n`);

  process.exit(counts.invalid > 0 ? 1 : 0);
}

run();