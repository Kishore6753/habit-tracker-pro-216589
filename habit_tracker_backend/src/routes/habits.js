const express = require('express');
const habitsController = require('../controllers/habits');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { habitsValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Habits
 *     description: Habit CRUD & listing
 */

/**
 * @swagger
 * /habits:
 *   get:
 *     tags: [Habits]
 *     summary: List habits (supports search/filter)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search term
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: frequency
 *         schema: { type: string, enum: [daily, weekly, monthly] }
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', requireAuth, habitsController.list.bind(habitsController));

/**
 * @swagger
 * /habits:
 *   post:
 *     tags: [Habits]
 *     summary: Create habit
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, frequency, targetPerPeriod]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               frequency: { type: string, enum: [daily, weekly, monthly] }
 *               targetPerPeriod: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', requireAuth, habitsValidators.create, handleValidation, habitsController.create.bind(habitsController));

/**
 * @swagger
 * /habits/{id}:
 *   get:
 *     tags: [Habits]
 *     summary: Get habit
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/:id', requireAuth, habitsValidators.idParam, handleValidation, habitsController.get.bind(habitsController));

/**
 * @swagger
 * /habits/{id}:
 *   put:
 *     tags: [Habits]
 *     summary: Update habit
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, frequency, targetPerPeriod, isActive]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               frequency: { type: string, enum: [daily, weekly, monthly] }
 *               targetPerPeriod: { type: integer, minimum: 1 }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.put('/:id', requireAuth, habitsValidators.idParam, habitsValidators.update, handleValidation, habitsController.update.bind(habitsController));

/**
 * @swagger
 * /habits/{id}:
 *   delete:
 *     tags: [Habits]
 *     summary: Delete habit
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.delete('/:id', requireAuth, habitsValidators.idParam, handleValidation, habitsController.remove.bind(habitsController));

module.exports = router;
