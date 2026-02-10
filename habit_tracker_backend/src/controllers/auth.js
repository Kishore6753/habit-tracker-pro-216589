const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/query');
const { ApiError } = require('../middleware/errors');

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, 'Server misconfigured: JWT_SECRET is not set');

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn }
  );
}

/**
 * Ensure core tables exist (users/habits/completions/reminders).
 * We keep this minimal and idempotent so the API works even if schema drift exists.
 * If your DB schema is already applied, these will be no-ops.
 */
async function ensureTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS habits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      frequency TEXT NOT NULL DEFAULT 'daily', -- daily|weekly|monthly
      target_per_period INT NOT NULL DEFAULT 1,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS completions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(user_id, habit_id, date)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS reminders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      cron TEXT, -- placeholder
      enabled BOOLEAN NOT NULL DEFAULT true,
      channel TEXT NOT NULL DEFAULT 'in_app', -- placeholder
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

class AuthController {
  async register(req, res, next) {
    try {
      await ensureTables();

      const { email, password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);

      const created = await query(
        'INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id, email, created_at',
        [email.toLowerCase(), passwordHash]
      );

      const user = created.rows[0];
      const token = signToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // set true behind HTTPS in prod
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({ user, token });
    } catch (err) {
      if (err.code === '23505') {
        return next(new ApiError(409, 'Email already registered'));
      }
      return next(err);
    }
  }

  async login(req, res, next) {
    try {
      await ensureTables();

      const { email, password } = req.body;

      const found = await query(
        'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
      if (found.rowCount === 0) return next(new ApiError(401, 'Invalid credentials'));

      const userRow = found.rows[0];
      const ok = await bcrypt.compare(password, userRow.password_hash);
      if (!ok) return next(new ApiError(401, 'Invalid credentials'));

      const user = { id: userRow.id, email: userRow.email, created_at: userRow.created_at };
      const token = signToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ user, token });
    } catch (err) {
      return next(err);
    }
  }

  async logout(_req, res) {
    res.clearCookie('token');
    return res.status(200).json({ status: 'ok' });
  }

  async me(req, res, next) {
    try {
      const userId = req.user.sub;

      const found = await query(
        'SELECT id, email, created_at FROM users WHERE id = $1',
        [userId]
      );
      if (found.rowCount === 0) return next(new ApiError(404, 'User not found'));

      return res.status(200).json({ user: found.rows[0] });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
