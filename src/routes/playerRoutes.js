const express = require('express');
const playerController = require('../controllers/playerController');
const {
  validateCreatePlayer,
  validateUpdatePlayer,
  validatePartialUpdatePlayer
} = require('../middlewares/playerValidator');

const router = express.Router();

// =============================================================================
// ANALYTICS ROUTES (Must be before /:id to avoid conflicts)
// =============================================================================

// GET /players/analytics/countries - Best and worst performing countries
router.get('/analytics/countries', playerController.getBestAndWorstCountry);

// GET /players/analytics/bmi - BMI analysis for all players
router.get('/analytics/bmi', playerController.getPlayersBMI);

// GET /players/analytics/height - Height statistics analysis
router.get('/analytics/height', playerController.getHeightStats);

// =============================================================================
// CRUD ROUTES
// =============================================================================

// GET /players - List all players with pagination, sorting, filtering
router.get('/', playerController.getAllPlayers);

// GET /players/:id - Get single player by ID
router.get('/:id', playerController.getPlayerById);

// POST /players - Create new player
router.post('/', validateCreatePlayer, playerController.createPlayer);

// PUT /players/:id - Full update of player
router.put('/:id', validateUpdatePlayer, playerController.updatePlayer);

// DELETE /players/:id - Delete player
router.delete('/:id', playerController.deletePlayer);

// =============================================================================
// SPECIALIZED UPDATE ROUTES
// =============================================================================

// PATCH /players/:id - Partial update of any player fields
router.patch('/:id', validatePartialUpdatePlayer, playerController.updatePlayerPartial);

// PATCH /players/:id/rank - Update only player rank
router.patch('/:id/rank', validatePartialUpdatePlayer, playerController.updatePlayerRank);

// PATCH /players/:id/stats - Update only player statistics
router.patch('/:id/stats', validatePartialUpdatePlayer, playerController.updatePlayerStats);

module.exports = router;