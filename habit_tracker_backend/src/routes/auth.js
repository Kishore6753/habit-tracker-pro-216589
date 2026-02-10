const express = require('express');
const authController = require('../controllers/auth');
const { handleValidation } = require('../middleware/errors');
const { requireAuth } = require('../middleware/auth');
const { authValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a user and returns a JWT (also set as httpOnly cookie).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Email already registered
 */
router.post('/register', authValidators.register, handleValidation, authController.register.bind(authController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     description: Validates credentials and returns a JWT (also set as httpOnly cookie).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authValidators.login, handleValidation, authController.login.bind(authController));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout
 *     description: Clears auth cookie.
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuth, authController.me.bind(authController));

module.exports = router;
