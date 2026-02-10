const { query } = require('../db/query');
const { ApiError } = require('../middleware/errors');

class RemindersController {
  async list(req, res, next) {
    try {
      const userId = req.user.sub;
      const result = await query(
        `SELECT id, habit_id, title, cron, enabled, channel, created_at, updated_at
         FROM reminders
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
      return res.status(200).json({ reminders: result.rows });
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.user.sub;
      const { habitId, title, cron, enabled, channel } = req.body;

      const result = await query(
        `INSERT INTO reminders(user_id, habit_id, title, cron, enabled, channel)
         VALUES($1, $2, $3, $4, $5, $6)
         RETURNING id, habit_id, title, cron, enabled, channel, created_at, updated_at`,
        [userId, habitId || null, title, cron || null, enabled ?? true, channel || 'in_app']
      );

      return res.status(201).json({
        reminder: result.rows[0],
        scheduler: { status: 'placeholder', message: 'Scheduler integration not yet implemented.' },
      });
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.user.sub;
      const { id } = req.params;
      const { habitId, title, cron, enabled, channel } = req.body;

      const result = await query(
        `UPDATE reminders
         SET habit_id = $1,
             title = $2,
             cron = $3,
             enabled = $4,
             channel = $5,
             updated_at = now()
         WHERE id = $6 AND user_id = $7
         RETURNING id, habit_id, title, cron, enabled, channel, created_at, updated_at`,
        [habitId || null, title, cron || null, enabled, channel, id, userId]
      );

      if (result.rowCount === 0) return next(new ApiError(404, 'Reminder not found'));

      return res.status(200).json({
        reminder: result.rows[0],
        scheduler: { status: 'placeholder', message: 'Scheduler integration not yet implemented.' },
      });
    } catch (err) {
      return next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.user.sub;
      const { id } = req.params;

      const result = await query(
        'DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      if (result.rowCount === 0) return next(new ApiError(404, 'Reminder not found'));

      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new RemindersController();
