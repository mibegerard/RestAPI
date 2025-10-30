// controllers/playerController.js
const playerService = require("../services/playerService");
const { ValidationError } = require("../utils/appError");
const catchError = require("../helper/catchError");

/**
 * Controller layer for players.
 * Only orchestrates request/response; all business logic lives in the service.
 */

class PlayerController {
  // --- READ ---
  getAllPlayers = catchError(async (req, res, next) => {
    const { page, limit, sort } = req.query;
    const result = await playerService.getAllPlayers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || "data.rank",
    });
    res.status(200).json({ success: true, data: result });
  });

  getPlayerById = catchError(async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid player ID");

    const player = await playerService.getPlayerById(id);
    res.status(200).json({ success: true, data: player });
  });

  // --- CREATE ---
  createPlayer = catchError(async (req, res, next) => {
    const playerData = req.body;
    const newPlayer = await playerService.createPlayer(playerData);
    res.status(201).json({ success: true, data: newPlayer });
  });

  // --- UPDATE ---
  updatePlayer = catchError(async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid player ID");

    const updatedPlayer = await playerService.updatePlayer(id, req.body);
    res.status(200).json({ success: true, data: updatedPlayer });
  });

  updatePlayerRank = catchError(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { rank } = req.body;
    if (isNaN(id)) throw new ValidationError("Invalid player ID");

    const updated = await playerService.updatePlayerRank(id, rank);
    res.status(200).json({ success: true, data: updated });
  });

  updatePlayerStats = catchError(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const statsUpdate = req.body;
    if (isNaN(id)) throw new ValidationError("Invalid player ID");

    const updated = await playerService.updatePlayerStats(id, statsUpdate);
    res.status(200).json({ success: true, data: updated });
  });

  /**
   * Partial update (PATCH) - Update any fields of a player.
   */
  updatePlayerPartial = catchError(async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid player ID");

    const partialData = req.body;
    const updated = await playerService.updatePlayerPartial(id, partialData);
    res.status(200).json({ success: true, data: updated });
  });

  // --- DELETE ---
  deletePlayer = catchError(async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid player ID");

    const result = await playerService.deletePlayer(id);
    res.status(200).json({ success: true, data: result });
  });

  // --- ANALYTICS ---
  getBestAndWorstCountry = catchError(async (req, res, next) => {
    const result = await playerService.getBestAndWorstCountry();
    res.status(200).json({ success: true, data: result });
  });

  getPlayersBMI = catchError(async (req, res, next) => {
    const result = await playerService.getPlayersBMI();
    res.status(200).json({ success: true, data: result });
  });

  getHeightStats = catchError(async (req, res, next) => {
    const result = await playerService.getHeightStats();
    res.status(200).json({ success: true, data: result });
  });
}

module.exports = new PlayerController();
