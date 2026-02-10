const express = require('express');
const remindersController = require('../controllers/reminders');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { remindersValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reminders
 *     description: Reminders CRUD (scheduler placeholder)
 */

/**
 * @swagger
 * /reminders:
 *   get:
 *     tags: [Reminders]
 *     summary: List reminders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', requireAuth, remindersController.list.bind(remindersController));

/**
 * @swagger
 * /reminders:
 *   post:
 *     tags: [Reminders]
 *     summary: Create reminder
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               habitId: { type: string, format: uuid }
 *               title: { type: string }
 *               cron: { type: string }
 *               enabled: { type: boolean }
 *               channel: { type: string, enum: [in_app, email, sms] }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', requireAuth, remindersValidators.create, handleValidation, remindersController.create.bind(remindersController));

/**
 * @swagger
 * /reminders/{id}:
 *   put:
 *     tags: [Reminders]
 *     summary: Update reminder
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
router.put('/:id', requireAuth, remindersValidators.idParam, remindersValidators.update, handleValidation, remindersController.update.bind(remindersController));

/**
 * @swagger
 * /reminders/{id}:
 *   delete:
 *     tags: [Reminders]
 *     summary: Delete reminder
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
router.delete('/:id', requireAuth, remindersValidators.idParam, handleValidation, remindersController.remove.bind(remindersController));

module.exports = router;
