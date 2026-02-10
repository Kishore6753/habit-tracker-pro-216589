const { query } = require('../db/query');

function toDateOnly(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function daysBetweenInclusive(from, to) {
  const start = new Date(from);
  const end = new Date(to);
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / ms) + 1;
}

class ProgressController {
  async summary(req, res, next) {
    try {
      const userId = req.user.sub;
      const { from, to } = req.query;

      const fromDate = from ? toDateOnly(from) : toDateOnly(new Date(Date.now() - 6 * 86400000));
      const toDate = to ? toDateOnly(to) : toDateOnly(new Date());

      const habitsRes = await query(
        `SELECT id, title, frequency, target_per_period
         FROM habits WHERE user_id = $1 AND is_active = true`,
        [userId]
      );

      const compRes = await query(
        `SELECT habit_id, date
         FROM completions
         WHERE user_id = $1 AND date BETWEEN $2 AND $3`,
        [userId, fromDate, toDate]
      );

      const totalDays = daysBetweenInclusive(fromDate, toDate);
      const byHabit = new Map();
      for (const h of habitsRes.rows) {
        byHabit.set(h.id, { habitId: h.id, title: h.title, completedDays: new Set(), streak: 0, percentage: 0 });
      }
      for (const c of compRes.rows) {
        const entry = byHabit.get(c.habit_id);
        if (entry) entry.completedDays.add(c.date);
      }

      // compute simple daily streak ending at toDate
      const out = [];
      for (const v of byHabit.values()) {
        let streak = 0;
        for (let i = 0; i < totalDays; i++) {
          const d = new Date(toDate);
          d.setDate(d.getDate() - i);
          const key = toDateOnly(d);
          if (v.completedDays.has(key)) streak += 1;
          else break;
        }
        v.streak = streak;
        v.percentage = totalDays === 0 ? 0 : Math.round((v.completedDays.size / totalDays) * 100);
        out.push({
          habitId: v.habitId,
          title: v.title,
          streak: v.streak,
          percentage: v.percentage,
          completedCount: v.completedDays.size,
          totalDays,
          from: fromDate,
          to: toDate,
        });
      }

      return res.status(200).json({ progress: out });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ProgressController();
