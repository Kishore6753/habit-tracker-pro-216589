const { query } = require('../db/query');

class CalendarController {
  async month(req, res, next) {
    try {
      const userId = req.user.sub;
      const { year, month } = req.query; // month: 1-12

      const y = Number(year);
      const m = Number(month);
      const from = new Date(Date.UTC(y, m - 1, 1));
      const to = new Date(Date.UTC(y, m, 0));

      const fromStr = from.toISOString().slice(0, 10);
      const toStr = to.toISOString().slice(0, 10);

      const comps = await query(
        `SELECT habit_id, date FROM completions
         WHERE user_id = $1 AND date BETWEEN $2 AND $3`,
        [userId, fromStr, toStr]
      );

      return res.status(200).json({
        year: y,
        month: m,
        from: fromStr,
        to: toStr,
        completions: comps.rows,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new CalendarController();
