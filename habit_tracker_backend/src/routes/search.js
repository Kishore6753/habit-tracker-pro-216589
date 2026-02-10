const express = require('express');
const searchController = require('../controllers/search');
const { requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errors');
const { searchValidators } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Search habits
 */

/**
 * @swagger
 * /search:
 *   get:
 *     tags: [Search]
 *     summary: Search habits
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get('/', requireAuth, searchValidators.search, handleValidation, searchController.search.bind(searchController));

module.exports = router;
