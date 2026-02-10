const { query } = require('../db/query');

class CompletionsController {
  async mark(req, res, next) {
    try {
      const userId = req.user.sub;
      const { habitId } = req.params;
      const { date } = req.body;

      const result = await query(
        `INSERT INTO completions(user_id, habit_id, date)
         VALUES($1, $2, $3)
         ON CONFLICT (user_id, habit_id, date) DO NOTHING
         RETURNING id, habit_id, date`,
        [userId, habitId, date]
      );

      return res.status(200).json({ completion: result.rows[0] || null });
    } catch (err) {
      return next(err);
    }
  }

  async unmark(req, res, next) {
    try {
      const userId = req.user.sub;
      const { habitId } = req.params;
      const { date } = req.body;

      await query(
        'DELETE FROM completions WHERE user_id = $1 AND habit_id = $2 AND date = $3',
        [userId, habitId, date]
      );

      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return next(err);
    }
  }

  async bulk(req, res, next) {
    try {
      const userId = req.user.sub;
      const { habitId } = req.params;
      const { dates, action } = req.body; // action: mark|unmark

      if (action === 'mark') {
        const values = dates.map((d, idx) => `($1, $2, $${idx + 3})`).join(', ');
        await query(
          `INSERT INTO completions(user_id, habit_id, date)
           VALUES ${values}
           ON CONFLICT (user_id, habit_id, date) DO NOTHING`,
          [userId, habitId, ...dates]
        );
      } else {
        const placeholders = dates.map((_, idx) => `$${idx + 3}`).join(', ');
        await query(
          `DELETE FROM completions
           WHERE user_id = $1 AND habit_id = $2 AND date IN (${placeholders})`,
          [userId, habitId, ...dates]
        );
      }

      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return next(err);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.sub;
      const { from, to, habitId } = req.query;

      const params = [userId];
      const where = ['user_id = $1'];

      if (habitId) {
        params.push(habitId);
        where.push(`habit_id = $${params.length}`);
      }
      if (from) {
        params.push(from);
        where.push(`date >= $${params.length}`);
      }
      if (to) {
        params.push(to);
        where.push(`date <= $${params.length}`);
      }

      const result = await query(
        `SELECT habit_id, date FROM completions WHERE ${where.join(' AND ')} ORDER BY date ASC`,
        params
      );

      return res.status(200).json({ completions: result.rows });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new CompletionsController();
