const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and connected to the database
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is running successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-28T21:26:36.832Z
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running successfully',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Welcome endpoint
 *     description: Get basic information about the API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Welcome message with API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to REST API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to REST API',
        version: '1.0.0',
        documentation: '/api-docs'
    });
});

module.exports = router;