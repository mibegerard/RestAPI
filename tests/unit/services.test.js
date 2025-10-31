const playerService = require('../../src/services/playerService');
const Player = require('../../src/models/player.model');
const { NotFoundError, ConflictError, ValidationError } = require('../../src/utils/appError');
const { createPlayerData, createPlayersData } = require('../shared/testHelpers');
const { samplePlayers } = require('../fixtures/players');

describe('PlayerService', () => {
  describe('getAllPlayers', () => {
    test('should return paginated players with default options', async () => {
      // Arrange
      const playersData = createPlayersData(5);
      await Player.insertMany(playersData);

      // Act
      const result = await playerService.getAllPlayers();

      // Assert
      expect(result).toMatchObject({
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1
      });
      expect(result.players).toHaveLength(5);
    });

    test('should handle pagination correctly', async () => {
      // Arrange
      const playersData = createPlayersData(15);
      await Player.insertMany(playersData);

      // Act
      const result = await playerService.getAllPlayers({ page: 2, limit: 5 });

      // Assert
      expect(result).toMatchObject({
        total: 15,
        page: 2,
        limit: 5,
        totalPages: 3
      });
      expect(result.players).toHaveLength(5);
    });

    test('should return empty result when no players exist', async () => {
      // Act
      const result = await playerService.getAllPlayers();

      // Assert
      expect(result).toMatchObject({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
      expect(result.players).toHaveLength(0);
    });
  });

  describe('getPlayerById', () => {
    test('should return player when found', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act
      const result = await playerService.getPlayerById(1);

      // Assert
      expect(result).toMatchObject({
        id: 1,
        firstname: playerData.firstname,
        lastname: playerData.lastname
      });
    });

    test('should throw NotFoundError when player does not exist', async () => {
      // Act & Assert
      await expect(playerService.getPlayerById(999))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('createPlayer', () => {
    test('should create player successfully with valid data', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });

      // Act
      const result = await playerService.createPlayer(playerData);

      // Assert
      expect(result).toMatchObject({
        id: 1,
        firstname: playerData.firstname,
        lastname: playerData.lastname,
        country: playerData.country
      });

      // Verify in database
      const inDb = await Player.findOne({ id: 1 });
      expect(inDb).toBeTruthy();
    });

    test('should throw ConflictError for duplicate ID', async () => {
      // Arrange
      const playerData1 = createPlayerData({ id: 1, shortname: 'TEST1' });
      const playerData2 = createPlayerData({ id: 1, shortname: 'TEST2' });
      
      await Player.create(playerData1);

      // Act & Assert
      await expect(playerService.createPlayer(playerData2))
        .rejects
        .toThrow(ConflictError);
    });

    test('should throw ConflictError for duplicate shortname', async () => {
      // Arrange
      const playerData1 = createPlayerData({ id: 1, shortname: 'TEST' });
      const playerData2 = createPlayerData({ id: 2, shortname: 'TEST' });
      
      await Player.create(playerData1);

      // Act & Assert
      await expect(playerService.createPlayer(playerData2))
        .rejects
        .toThrow(ConflictError);
    });
  });

  describe('updatePlayer', () => {
    test('should update player successfully', async () => {
      // Arrange
      const originalData = createPlayerData({ id: 1 });
      await Player.create(originalData);

      const updateData = createPlayerData({ 
        id: 1, 
        firstname: 'Updated',
        lastname: 'Name',
        country: {
          code: 'ESP',
          picture: 'https://example.com/flag.jpg'
        }
      });

      // Act
      const result = await playerService.updatePlayer(1, updateData);

      // Assert
      expect(result.firstname).toBe('Updated');
      expect(result.lastname).toBe('Name');
      expect(result.country.code).toBe('ESP');
    });

    test('should throw NotFoundError when updating non-existent player', async () => {
      // Arrange
      const updateData = createPlayerData({ id: 999 });

      // Act & Assert
      await expect(playerService.updatePlayer(999, updateData))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('updatePlayerPartial', () => {
    test('should update only provided fields', async () => {
      // Arrange
      const originalData = createPlayerData({ 
        id: 1, 
        firstname: 'Original',
        data: {
          ...createPlayerData().data,
          weight: 75000
        }
      });
      await Player.create(originalData);

      // Act
      const result = await playerService.updatePlayerPartial(1, { 
        firstname: 'Updated' 
      });

      // Assert
      expect(result.firstname).toBe('Updated');
      expect(result.data.weight).toBe(75000); // Should remain unchanged
    });

    test('should throw ValidationError when trying to update ID', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act & Assert
      await expect(playerService.updatePlayerPartial(1, { id: 999 }))
        .rejects
        .toThrow(ValidationError);
    });

    test('should throw ValidationError with no valid fields', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act & Assert
      await expect(playerService.updatePlayerPartial(1, {}))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('deletePlayer', () => {
    test('should delete player successfully', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act
      const result = await playerService.deletePlayer(1);

      // Assert
      expect(result.message).toContain('deleted successfully');
      
      // Verify deletion
      const deleted = await Player.findOne({ id: 1 });
      expect(deleted).toBeNull();
    });

    test('should throw NotFoundError when deleting non-existent player', async () => {
      // Act & Assert
      await expect(playerService.deletePlayer(999))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('Analytics Methods', () => {
    beforeEach(async () => {
      // Setup test data for analytics
      const testPlayers = samplePlayers.map((player, index) => ({
        id: index + 1,
        firstname: player.name.split(' ')[0],
        lastname: player.name.split(' ')[1] || 'Player',
        shortname: `P${index + 1}`,
        sex: 'M',
        picture: player.picture,
        country: {
          code: player.country,
          picture: 'https://example.com/flag.jpg'
        },
        data: {
          rank: index + 1,
          points: 1000 + index * 100,
          weight: player.weight * 1000, // Convert to grams
          height: player.height,
          age: 2025 - player.birthYear,
          last: [1, 1, 0, 1, 0] // Sample win/loss record
        }
      }));
      
      await Player.insertMany(testPlayers);
    });

    describe('getBestAndWorstCountry', () => {
      test('should return country win ratio analysis', async () => {
        // Act
        const result = await playerService.getBestAndWorstCountry();

        // Assert
        expect(result).toHaveProperty('best');
        expect(result).toHaveProperty('worst');
        expect(Array.isArray(result.best)).toBe(true);
        expect(Array.isArray(result.worst)).toBe(true);
      });

      test('should throw NotFoundError when no players exist', async () => {
        // Arrange
        await Player.deleteMany({});

        // Act & Assert
        await expect(playerService.getBestAndWorstCountry())
          .rejects
          .toThrow(NotFoundError);
      });
    });

    describe('getPlayersBMI', () => {
      test('should calculate BMI for all players', async () => {
        // Act
        const result = await playerService.getPlayersBMI();

        // Assert
        expect(result).toHaveProperty('average');
        expect(result).toHaveProperty('players');
        expect(Array.isArray(result.players)).toBe(true);
        expect(typeof result.average).toBe('number');
        
        // Check BMI calculation
        result.players.forEach(player => {
          expect(player).toHaveProperty('bmi');
          expect(typeof player.bmi).toBe('number');
        });
      });

      test('should throw NotFoundError when no players exist', async () => {
        // Arrange
        await Player.deleteMany({});

        // Act & Assert
        await expect(playerService.getPlayersBMI())
          .rejects
          .toThrow(NotFoundError);
      });
    });

    describe('getHeightStats', () => {
      test('should return height statistics', async () => {
        // Act
        const result = await playerService.getHeightStats();

        // Assert
        expect(result).toHaveProperty('min');
        expect(result).toHaveProperty('max');
        expect(result).toHaveProperty('average');
        expect(result).toHaveProperty('median');
        
        expect(typeof result.min).toBe('number');
        expect(typeof result.max).toBe('number');
        expect(typeof result.average).toBe('number');
        expect(typeof result.median).toBe('number');
        
        expect(result.min).toBeLessThanOrEqual(result.max);
      });

      test('should throw NotFoundError when no players exist', async () => {
        // Arrange
        await Player.deleteMany({});

        // Act & Assert
        await expect(playerService.getHeightStats())
          .rejects
          .toThrow(NotFoundError);
      });
    });
  });
});