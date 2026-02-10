const { query } = require('../db/query');

class AnalyticsController {
  async overview(req, res, next) {
    try {
      const userId = req.user.sub;
      const { from, to } = req.query;

      const now = new Date().toISOString().slice(0, 10);
      const fromDate = from || new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
      const toDate = to || now;

      const habits = await query(
        'SELECT COUNT(*)::int AS count FROM habits WHERE user_id = $1 AND is_active = true',
        [userId]
      );

      const completions = await query(
        `SELECT COUNT(*)::int AS count
         FROM completions
         WHERE user_id = $1 AND date BETWEEN $2 AND $3`,
        [userId, fromDate, toDate]
      );

      const top = await query(
        `SELECT h.id, h.title, COUNT(c.id)::int AS completion_count
         FROM habits h
         LEFT JOIN completions c
           ON c.habit_id = h.id AND c.user_id = $1 AND c.date BETWEEN $2 AND $3
         WHERE h.user_id = $1
         GROUP BY h.id, h.title
         ORDER BY completion_count DESC, h.title ASC
         LIMIT 5`,
        [userId, fromDate, toDate]
      );

      return res.status(200).json({
        range: { from: fromDate, to: toDate },
        activeHabits: habits.rows[0].count,
        completions: completions.rows[0].count,
        topHabits: top.rows,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AnalyticsController();
