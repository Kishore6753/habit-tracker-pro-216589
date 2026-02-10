const express = require('express');
const exportController = require('../controllers/export');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { exportValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Export
 *     description: Export reports
 */

/**
 * @swagger
 * /export:
 *   get:
 *     tags: [Export]
 *     summary: Export data (json/csv)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [json, csv] }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: OK }
 */
router.get('/', requireAuth, exportValidators.export, handleValidation, exportController.export.bind(exportController));

module.exports = router;
