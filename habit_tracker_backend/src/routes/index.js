const express = require('express');
const healthController = require('../controllers/health');
const { query } = require('../db/query');

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

/**
 * @swagger
 * /healthz/db:
 *   get:
 *     tags: [Health]
 *     summary: Database connectivity health check
 *     description: Performs a lightweight `SELECT 1` against Postgres to validate DB connectivity.
 *     responses:
 *       200:
 *         description: DB connection OK
 *       500:
 *         description: DB connection failed
 */
// PUBLIC_INTERFACE
router.get('/healthz/db', async (_req, res, next) => {
  /** Health check endpoint that verifies DB connectivity with a lightweight SELECT 1. */
  try {
    const started = Date.now();
    await query('SELECT 1 AS ok');
    return res.status(200).json({ status: 'ok', db: 'ok', latencyMs: Date.now() - started });
  } catch (err) {
    return next(err);
  }
});

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
