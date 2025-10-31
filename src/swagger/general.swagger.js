/**
 * @swagger
 * tags:
 *   - name: General
 *     description: Endpoints généraux de l'API
 *
 * /:
 *   get:
 *     summary: Informations de l'API
 *     description: Récupère les informations générales sur l'API et ses endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Informations API récupérées avec succès
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
 *                   example: "Welcome to RestAPI"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     players:
 *                       type: string
 *                       example: "/api/players"
 *                     health:
 *                       type: string
 *                       example: "/api/health"
 *
 * /health:
 *   get:
 *     summary: Vérification de santé de l'API
 *     description: Endpoint pour vérifier si l'API fonctionne correctement
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API fonctionnelle
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
 *                   example: "API is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */

// Ce fichier contient uniquement la documentation Swagger pour les endpoints généraux
// Les routes sont définies dans /routes/index.js
module.exports = {};
