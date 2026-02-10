const express = require('express');
const analyticsController = require('../controllers/analytics');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { analyticsValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Aggregate analytics
 */

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Overview analytics
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
router.get('/overview', requireAuth, analyticsValidators.overview, handleValidation, analyticsController.overview.bind(analyticsController));

module.exports = router;
