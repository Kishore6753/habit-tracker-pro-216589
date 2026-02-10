const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const habitsRoutes = require('./habits');
const completionsRoutes = require('./completions');
const progressRoutes = require('./progress');
const calendarRoutes = require('./calendar');
const remindersRoutes = require('./reminders');
const analyticsRoutes = require('./analytics');
const searchRoutes = require('./search');
const exportRoutes = require('./export');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags: [System]
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount API routes
router.use('/auth', authRoutes);
router.use('/habits', habitsRoutes);
router.use('/completions', completionsRoutes);
router.use('/progress', progressRoutes);
router.use('/calendar', calendarRoutes);
router.use('/reminders', remindersRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/search', searchRoutes);
router.use('/export', exportRoutes);

module.exports = router;
