/**
 * @swagger
 * tags:
 *   - name: Players
 *     description: Gestion des joueurs de tennis
 *   - name: Analytics
 *     description: Statistiques et analyses des joueurs
 * 
 * /players:
 *   get:
 *     summary: Liste tous les joueurs
 *     description: Récupère la liste paginée des joueurs avec options de tri et filtrage
 *     tags: [Players]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [firstname, lastname, data.rank, data.points, data.age]
 *           default: data.rank
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordre de tri
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: "Filtrer par code pays (ex: ESP, FRA)"
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [M, F]
 *         description: Filtrer par sexe
 *     responses:
 *       200:
 *         description: Liste des joueurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 * 
 *   post:
 *     summary: Créer un nouveau joueur
 *     description: Ajoute un nouveau joueur à la base de données
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerInput'
 *     responses:
 *       201:
 *         description: Joueur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Données de validation invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Conflit - ID ou shortname déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 * 
 * /players/{id}:
 *   get:
 *     summary: Récupérer un joueur par ID
 *     description: Récupère les détails d'un joueur spécifique
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     responses:
 *       200:
 *         description: Joueur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Player'
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 *   put:
 *     summary: Mise à jour complète d'un joueur
 *     description: Met à jour toutes les données d'un joueur
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerInput'
 *     responses:
 *       200:
 *         description: Joueur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 *   patch:
 *     summary: Mise à jour partielle d'un joueur
 *     description: Met à jour seulement les champs fournis
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerPartial'
 *     responses:
 *       200:
 *         description: Joueur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 *   delete:
 *     summary: Supprimer un joueur
 *     description: Supprime définitivement un joueur de la base de données
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     responses:
 *       200:
 *         description: Joueur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 * /players/{id}/rank:
 *   patch:
 *     summary: Mettre à jour le rang d'un joueur
 *     description: Met à jour uniquement le rang du joueur
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                     description: Nouveau rang du joueur
 *             required: [data]
 *     responses:
 *       200:
 *         description: Rang mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 * /players/{id}/stats:
 *   patch:
 *     summary: Mettre à jour les statistiques d'un joueur
 *     description: "Met à jour les statistiques (points, derniers résultats) du joueur"
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   points:
 *                     type: integer
 *                     example: 3000
 *                   last:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       enum: [0, 1]
 *                     example: [1, 1, 0, 1, 1]
 *     responses:
 *       200:
 *         description: Statistiques mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 * 
 * /players/analytics/countries:
 *   get:
 *     summary: Statistiques par pays
 *     description: "Analyse des performances par pays (meilleurs et pires taux de victoire)"
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Statistiques par pays récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     bestCountries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CountryStats'
 *                     worstCountries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CountryStats'
 * 
 * /players/analytics/bmi:
 *   get:
 *     summary: Analyse BMI des joueurs
 *     description: Classification des joueurs par catégories BMI avec statistiques
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Analyse BMI récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BMIAnalysis'
 * 
 * /players/analytics/height:
 *   get:
 *     summary: Statistiques de taille
 *     description: "Analyse statistique des tailles des joueurs (min, max, moyenne, médiane)"
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Statistiques de taille récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HeightStats'
 */

// Ce fichier contient uniquement la documentation Swagger pour les endpoints Players
// Les routes sont définies dans /routes/playerRoutes.js
module.exports = {};