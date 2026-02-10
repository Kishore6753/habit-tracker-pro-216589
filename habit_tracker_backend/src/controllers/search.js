const { query } = require('../db/query');

class SearchController {
  async search(req, res, next) {
    try {
      const userId = req.user.sub;
      const { q } = req.query;

      if (!q) return res.status(200).json({ habits: [] });

      const result = await query(
        `SELECT id, title, description, category, frequency, target_per_period, is_active, created_at, updated_at
         FROM habits
         WHERE user_id = $1 AND (title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2)
         ORDER BY created_at DESC`,
        [userId, `%${q}%`]
      );

      return res.status(200).json({ habits: result.rows });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new SearchController();
