const { query } = require('../db/query');

function toCsv(rows) {
  const header = ['habit_id', 'date'].join(',');
  const lines = rows.map((r) => `${r.habit_id},${r.date}`);
  return [header, ...lines].join('\n');
}

class ExportController {
  async export(req, res, next) {
    try {
      const userId = req.user.sub;
      const { format, from, to } = req.query;

      const fromDate = from || new Date(Date.now() - 89 * 86400000).toISOString().slice(0, 10);
      const toDate = to || new Date().toISOString().slice(0, 10);

      const habits = await query(
        `SELECT id, title, description, category, frequency, target_per_period, is_active, created_at, updated_at
         FROM habits WHERE user_id = $1`,
        [userId]
      );

      const completions = await query(
        `SELECT habit_id, date FROM completions
         WHERE user_id = $1 AND date BETWEEN $2 AND $3
         ORDER BY date ASC`,
        [userId, fromDate, toDate]
      );

      if ((format || 'json') === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="habit_export.csv"');
        return res.status(200).send(toCsv(completions.rows));
      }

      return res.status(200).json({
        range: { from: fromDate, to: toDate },
        habits: habits.rows,
        completions: completions.rows,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ExportController();
