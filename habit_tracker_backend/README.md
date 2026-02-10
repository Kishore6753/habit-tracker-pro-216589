# Habit Tracker Backend (Express)

Backend REST API for the Habit Tracker app.

## Agreed local dev ports

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Postgres: localhost:5001

## Required environment variables

Create a `.env` based on `.env.example`.

### Server

- `PORT` (default 3001)
- `HOST` (default `0.0.0.0`)
- `NODE_ENV` (e.g. `development`)

### CORS

- `FRONTEND_ORIGIN` (optional)
  - If set, it is added to the allowlist.
  - `http://localhost:3000` is always allowed by default.

### Auth

- `JWT_SECRET` (required): secret used to sign JWTs
- `JWT_EXPIRES_IN` (optional, default `7d`)

### Database (Postgres)

Use either:

- `POSTGRES_URL` (preferred), or

Discrete variables:

- `POSTGRES_HOST` (optional, default `localhost`)
- `POSTGRES_PORT` (optional, default `5001`)
- `POSTGRES_DB` (required)
- `POSTGRES_USER` (required)
- `POSTGRES_PASSWORD` (required)

## Smoke check endpoints

- `GET /` → service health
- `GET /healthz/db` → DB connectivity (runs `SELECT 1`)
- `GET /docs` → Swagger UI
