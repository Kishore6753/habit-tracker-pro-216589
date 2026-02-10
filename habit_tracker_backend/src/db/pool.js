const { Pool } = require('pg');

/**
 * Create a Postgres Pool from environment variables.
 *
 * Supported env var patterns:
 * - POSTGRES_URL (preferred): full connection string
 * - Otherwise: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT (+ host fallback)
 *
 * IMPORTANT:
 * The database container exposes env vars: POSTGRES_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT.
 * Do not hardcode credentials.
 */

function buildPoolConfigFromEnv() {
  // Prefer a single URL if provided (common in container setups).
  if (process.env.POSTGRES_URL) {
    return {
      connectionString: process.env.POSTGRES_URL,
    };
  }

  // Otherwise compose from discrete variables.
  // Host is not provided in the db_env_vars list; defaulting to localhost is typical in this environment.
  // If your deployment uses a different host, set POSTGRES_HOST in the environment.
  const host = process.env.POSTGRES_HOST || 'localhost';

  const port = process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : undefined;

  return {
    host,
    port,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };
}

const pool = new Pool(buildPoolConfigFromEnv());

module.exports = {
  pool,
};
