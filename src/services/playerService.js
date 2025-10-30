const Player = require('../models/player.model');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/appError');
const { calculateBMI, average, median } = require('../utils/compute');
const { computeCountryWinRatios } = require('../utils/stats');

class PlayerService {
  // --- READ OPERATIONS ---

  /**
   * Fetch all players with optional pagination, sorting, and filtering.
   */
  async getAllPlayers({ page = 1, limit = 10, sort = 'data.rank', filter = {} } = {}) {
    const skip = (page - 1) * limit;

    const players = await Player.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Player.countDocuments(filter);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      players,
    };
  }

  /**
   * Get one player by numeric ID.
   */
  async getPlayerById(id) {
    const player = await Player.findOne({ id }).lean();
    if (!player) throw new NotFoundError(`Player with id ${id} not found`);
    return player;
  }

  // --- CREATE OPERATIONS ---

  /**
   * Create a new player (checks for duplicate ID or shortname).
   */
  async createPlayer(playerData) {
    const existing = await Player.findOne({
      $or: [{ id: playerData.id }, { shortname: playerData.shortname }],
    });
    if (existing) throw new ConflictError('Player with same ID or shortname already exists');

    const player = await Player.create(playerData);
    return player.toObject();
  }

  // --- UPDATE OPERATIONS ---

  /**
   * Full update or replacement of a player (fields must be validated before).
   */
  async updatePlayer(id, newData) {
    const updated = await Player.findOneAndUpdate({ id }, newData, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new NotFoundError(`Player with id ${id} not found`);
    return updated.toObject();
  }

  /**
   * Update only the player's rank field (must stay positive).
   */
  async updatePlayerRank(id, newRank) {
    if (typeof newRank !== 'number' || newRank <= 0)
      throw new ValidationError('Rank must be a positive number');

    const updated = await Player.findOneAndUpdate(
      { id },
      { 'data.rank': newRank },
      { new: true, runValidators: true }
    );

    if (!updated) throw new NotFoundError(`Player with id ${id} not found`);
    return updated.toObject();
  }

  /**
   * Update specific player stats (partial update on 'data' object).
   */
  async updatePlayerStats(id, statsUpdate) {
    const allowedFields = ['points', 'weight', 'height', 'age', 'last'];
    const updateData = {};

    for (const key of allowedFields) {
      if (key in statsUpdate) updateData[`data.${key}`] = statsUpdate[key];
    }

    if (Object.keys(updateData).length === 0)
      throw new ValidationError('No valid stats fields provided');

    const updated = await Player.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new NotFoundError(`Player with id ${id} not found`);
    return updated.toObject();
  }

/**
 * Partial update (PATCH) - Update any fields of a player without replacing the entire object.
 * Respects HTTP PATCH semantics: only modifies provided fields, leaves others unchanged.
 */
  async updatePlayerPartial(id, partialData) {
  if ('id' in partialData) throw new ValidationError('Player ID cannot be modified');

  const allowedTop = ['firstname', 'lastname', 'shortname', 'sex', 'picture'];
  const updateData = {};

  // --- Top-level fields ---
  for (const field of allowedTop) {
    if (field in partialData) updateData[field] = partialData[field];
  }

  // --- Nested objects ---
  const nestedKeys = ['country', 'data'];
  let currentPlayer;

  for (const key of nestedKeys) {
    if (key in partialData && typeof partialData[key] === 'object') {
      currentPlayer = currentPlayer || await Player.findOne({ id }).lean();
      if (!currentPlayer) throw new NotFoundError(`Player with id ${id} not found`);
      updateData[key] = { ...currentPlayer[key], ...partialData[key] };
    }
  }

  if (Object.keys(updateData).length === 0)
    throw new ValidationError('No valid fields provided for update');

  // --- shortname uniqueness ---
  if ('shortname' in updateData) {
    const existing = await Player.findOne({ 
      shortname: updateData.shortname.toUpperCase(), 
      id: { $ne: id } 
    });
    if (existing) throw new ConflictError('Another player with this shortname exists');
    updateData.shortname = updateData.shortname.toUpperCase();
  }

  // --- Perform update ---
  const updated = await Player.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new NotFoundError(`Player with id ${id} not found`);
  return updated.toObject();
}


  // --- DELETE OPERATIONS ---

  /**
   * Delete one player by ID.
   */
  async deletePlayer(id) {
    const deleted = await Player.findOneAndDelete({ id });
    if (!deleted) throw new NotFoundError(`Player with id ${id} not found`);
    return { message: `Player with id ${id} deleted successfully` };
  }

  // --- ANALYTICS OPERATIONS ---

  /**
   * Compute the best and worst performing countries based on last 5 matches.
   */
  async getBestAndWorstCountry() {
    const players = await Player.find().lean();
    if (!players.length) throw new NotFoundError('No players found for analysis');

    return computeCountryWinRatios(players);
  }

  /**
   * Compute BMI for each player and return sorted list with average.
   */
  async getPlayersBMI() {
    const players = await Player.find().lean();
    if (!players.length) throw new NotFoundError('No players found for BMI analysis');

    const bmiList = players.map((p) => ({
      id: p.id,
      name: `${p.firstname} ${p.lastname}`,
      bmi: calculateBMI(p.data.weight, p.data.height),
    }));

    const validBMI = bmiList.filter((b) => b.bmi !== null);
    const avgBMI = average(validBMI.map((b) => b.bmi));

    return {
      average: avgBMI,
      players: validBMI.sort((a, b) => b.bmi - a.bmi),
    };
  }

  /**
   * Calculate min, max, average, and median height across all players.
   */
  async getHeightStats() {
    const players = await Player.find().lean();
    if (!players.length) throw new NotFoundError('No players found for height analysis');

    const heights = players.map((p) => p.data.height).filter((h) => typeof h === 'number');
    if (!heights.length) throw new ValidationError('No valid height data found');

    return {
      min: Math.min(...heights),
      max: Math.max(...heights),
      average: average(heights),
      median: median(heights),
    };
  }
}

module.exports = new PlayerService();
