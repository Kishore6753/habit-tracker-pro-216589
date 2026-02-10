const express = require('express');
const calendarController = require('../controllers/calendar');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { calendarValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Calendar
 *     description: Calendar views
 */

/**
 * @swagger
 * /calendar/month:
 *   get:
 *     tags: [Calendar]
 *     summary: Get month completions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 12 }
 *     responses:
 *       200: { description: OK }
 */
router.get('/month', requireAuth, calendarValidators.month, handleValidation, calendarController.month.bind(calendarController));

module.exports = router;
