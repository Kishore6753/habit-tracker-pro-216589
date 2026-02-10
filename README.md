# Project Repository

Habit Tracker app composed of:
- React frontend (port 3000)
- Express backend (port 3001)
- Postgres database (port 5001)

## Local integration (ports & env)

### Backend (Express)
- Runs on: `http://localhost:3001`
- Configure via: `habit-tracker-pro-216589/habit_tracker_backend/.env` (copy from `.env.example`)

Key env vars:
- `PORT=3001`
- `FRONTEND_ORIGIN=http://localhost:3000`
- DB (discrete): `POSTGRES_HOST=localhost`, `POSTGRES_PORT=5001`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
  - or `POSTGRES_URL` instead.

Health checks:
- `GET /` (service)
- `GET /healthz/db` (runs `SELECT 1`)

Smoke test:
- `cd habit-tracker-pro-216589/habit_tracker_backend`
- `npm run smoke`
  - Optional override: `API_BASE=http://localhost:3001 npm run smoke`

### Frontend (React)
- Runs on: `http://localhost:3000`
- Configure via: `habit-tracker-pro-216590/habit_tracker_frontend/.env` (copy from `.env.example`)

Key env var:
- `REACT_APP_API_BASE=http://localhost:3001`

Notes:
- Frontend requests use `credentials: 'include'`
- Backend CORS allows `http://localhost:3000` with `credentials: true`