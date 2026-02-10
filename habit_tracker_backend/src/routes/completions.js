const express = require('express');
const completionsController = require('../controllers/completions');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { completionsValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Completions
 *     description: Mark/unmark completions
 */

/**
 * @swagger
 * /completions:
 *   get:
 *     tags: [Completions]
 *     summary: List completions for a date range
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: habitId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: OK }
 */
router.get('/', requireAuth, completionsValidators.list, handleValidation, completionsController.list.bind(completionsController));

/**
 * @swagger
 * /completions/{habitId}/mark:
 *   post:
 *     tags: [Completions]
 *     summary: Mark completion
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date]
 *             properties:
 *               date: { type: string, format: date }
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/:habitId/mark',
  requireAuth,
  completionsValidators.habitIdParam,
  completionsValidators.mark,
  handleValidation,
  completionsController.mark.bind(completionsController)
);

/**
 * @swagger
 * /completions/{habitId}/unmark:
 *   post:
 *     tags: [Completions]
 *     summary: Unmark completion
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date]
 *             properties:
 *               date: { type: string, format: date }
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/:habitId/unmark',
  requireAuth,
  completionsValidators.habitIdParam,
  completionsValidators.mark,
  handleValidation,
  completionsController.unmark.bind(completionsController)
);

/**
 * @swagger
 * /completions/{habitId}/bulk:
 *   post:
 *     tags: [Completions]
 *     summary: Bulk mark or unmark
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action, dates]
 *             properties:
 *               action: { type: string, enum: [mark, unmark] }
 *               dates:
 *                 type: array
 *                 items: { type: string, format: date }
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/:habitId/bulk',
  requireAuth,
  completionsValidators.habitIdParam,
  completionsValidators.bulk,
  handleValidation,
  completionsController.bulk.bind(completionsController)
);

module.exports = router;
