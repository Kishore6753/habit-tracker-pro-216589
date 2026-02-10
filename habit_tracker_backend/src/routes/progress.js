const express = require('express');
const progressController = require('../controllers/progress');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { progressValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Progress
 *     description: Streaks and completion percentages
 */

/**
 * @swagger
 * /progress/summary:
 *   get:
 *     tags: [Progress]
 *     summary: Progress summary (streaks & percentages)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: OK }
 */
router.get('/summary', requireAuth, progressValidators.summary, handleValidation, progressController.summary.bind(progressController));

module.exports = router;
