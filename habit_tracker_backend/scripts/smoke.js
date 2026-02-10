/* eslint-disable no-console */

/**
 * Minimal smoke test runner for the backend.
 *
 * Usage:
 *   API_BASE=http://localhost:3001 node scripts/smoke.js
 *   # or via npm:
 *   npm run smoke
 *
 * This script performs:
 *  - GET /
 *  - GET /healthz/db
 *
 * Exits non-zero on failure.
 */

const DEFAULT_BASE = 'http://localhost:3001';

function getBaseUrl() {
  const raw = process.env.API_BASE || DEFAULT_BASE;
  return raw.replace(/\/+$/, '');
}

async function pingJson(url) {
  const started = Date.now();
  const res = await fetch(url, { method: 'GET' });
  const text = await res.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  return {
    url,
    ok: res.ok,
    status: res.status,
    latencyMs: Date.now() - started,
    payload,
  };
}

async function main() {
  const base = getBaseUrl();

  const targets = [`${base}/`, `${base}/healthz/db`];

  console.log(`Smoke testing API at: ${base}`);
  let ok = true;

  for (const t of targets) {
    try {
      const result = await pingJson(t);
      const line = `${result.ok ? 'OK ' : 'BAD'} ${result.status} ${result.latencyMs}ms ${result.url}`;
      console.log(line);
      if (!result.ok) {
        ok = false;
        console.log('  payload:', result.payload);
      }
    } catch (e) {
      ok = false;
      console.log(`ERR ${t}`);
      console.log('  error:', e && e.message ? e.message : String(e));
    }
  }

  if (!ok) {
    console.log('Smoke test: FAILED');
    process.exit(1);
  }

  console.log('Smoke test: PASSED');
}

main();
