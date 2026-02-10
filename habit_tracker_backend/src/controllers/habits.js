const { query } = require('../db/query');
const { ApiError } = require('../middleware/errors');

class HabitsController {
  async list(req, res, next) {
    try {
      const userId = req.user.sub;
      const { q, category, frequency, active } = req.query;

      const filters = ['user_id = $1'];
      const params = [userId];

      if (typeof active !== 'undefined') {
        params.push(active === 'true');
        filters.push(`is_active = $${params.length}`);
      }
      if (category) {
        params.push(category);
        filters.push(`category = $${params.length}`);
      }
      if (frequency) {
        params.push(frequency);
        filters.push(`frequency = $${params.length}`);
      }
      if (q) {
        params.push(`%${q}%`);
        filters.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
      }

      const sql = `
        SELECT id, title, description, category, frequency, target_per_period, is_active, created_at, updated_at
        FROM habits
        WHERE ${filters.join(' AND ')}
        ORDER BY created_at DESC
      `;

      const result = await query(sql, params);
      return res.status(200).json({ habits: result.rows });
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    try {
      const userId = req.user.sub;
      const { id } = req.params;

      const result = await query(
        `SELECT id, title, description, category, frequency, target_per_period, is_active, created_at, updated_at
         FROM habits WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (result.rowCount === 0) return next(new ApiError(404, 'Habit not found'));
      return res.status(200).json({ habit: result.rows[0] });
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.user.sub;
      const { title, description, category, frequency, targetPerPeriod } = req.body;

      const result = await query(
        `INSERT INTO habits(user_id, title, description, category, frequency, target_per_period)
         VALUES($1, $2, $3, $4, $5, $6)
         RETURNING id, title, description, category, frequency, target_per_period, is_active, created_at, updated_at`,
        [userId, title, description || null, category || null, frequency, targetPerPeriod]
      );

      return res.status(201).json({ habit: result.rows[0] });
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.user.sub;
      const { id } = req.params;
      const { title, description, category, frequency, targetPerPeriod, isActive } = req.body;

      const result = await query(
        `UPDATE habits
         SET title = $1,
             description = $2,
             category = $3,
             frequency = $4,
             target_per_period = $5,
             is_active = $6,
             updated_at = now()
         WHERE id = $7 AND user_id = $8
         RETURNING id, title, description, category, frequency, target_per_period, is_active, created_at, updated_at`,
        [
          title,
          description || null,
          category || null,
          frequency,
          targetPerPeriod,
          isActive,
          id,
          userId,
        ]
      );

      if (result.rowCount === 0) return next(new ApiError(404, 'Habit not found'));
      return res.status(200).json({ habit: result.rows[0] });
    } catch (err) {
      return next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.user.sub;
      const { id } = req.params;

      const result = await query(
        'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );

      if (result.rowCount === 0) return next(new ApiError(404, 'Habit not found'));
      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new HabitsController();
