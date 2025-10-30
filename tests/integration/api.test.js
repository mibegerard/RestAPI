const request = require('supertest');
const app = require('../../src/app');
const Player = require('../../src/models/player.model');
const { createPlayerData, createPlayersData } = require('../shared/testHelpers');
const { samplePlayers, partialUpdateData } = require('../fixtures/players');

describe('Players API Integration Tests', () => {
  describe('Health & Info Endpoints', () => {
    test('GET /api/health should return API health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'API is running'
      });
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /api should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Welcome to RestAPI',
        version: '1.0.0',
        endpoints: {
          players: '/api/players',
          health: '/api/health'
        }
      });
    });
  });

  describe('GET /api/players', () => {
    test('should return empty list when no players exist', async () => {
      const response = await request(app)
        .get('/api/players')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          players: []
        }
      });
    });

    test('should return paginated players list', async () => {
      // Arrange
      const playersData = createPlayersData(5);
      await Player.insertMany(playersData);

      // Act
      const response = await request(app)
        .get('/api/players?page=1&limit=3')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(5);
      expect(response.body.data.players).toHaveLength(3);
      expect(response.body.data.totalPages).toBe(2);
    });

    test('should handle sorting parameters', async () => {
      // Arrange
      const playersData = createPlayersData(3).map((player, index) => ({
        ...player,
        data: { ...player.data, rank: 3 - index } // ranks: 3, 2, 1
      }));
      await Player.insertMany(playersData);

      // Act
      const response = await request(app)
        .get('/api/players?sort=data.rank')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      const ranks = response.body.data.players.map(p => p.data.rank);
      expect(ranks).toEqual([1, 2, 3]); // Should be sorted ascending
    });
  });

  describe('GET /api/players/:id', () => {
    test('should return specific player by ID', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act
      const response = await request(app)
        .get('/api/players/1')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.firstname).toBe(playerData.firstname);
      expect(response.body.data.lastname).toBe(playerData.lastname);
    });

    test('should return 404 for non-existent player', async () => {
      const response = await request(app)
        .get('/api/players/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/players/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid player ID');
    });
  });

  describe('POST /api/players', () => {
    test('should create new player with valid data', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });

      // Act
      const response = await request(app)
        .post('/api/players')
        .send(playerData)
        .expect(201);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      
      // Verify in database
      const inDb = await Player.findOne({ id: 1 });
      expect(inDb).toBeTruthy();
    });

    test('should return 400 for invalid player data', async () => {
      // Arrange - missing required field
      const invalidData = { name: 'Test Player' };

      // Act
      const response = await request(app)
        .post('/api/players')
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Missing required field');
    });

    test('should return 409 for duplicate player ID', async () => {
      // Arrange
      const playerData1 = createPlayerData({ id: 1, shortname: 'TEST1' });
      const playerData2 = createPlayerData({ id: 1, shortname: 'TEST2' });
      
      await Player.create(playerData1);

      // Act
      const response = await request(app)
        .post('/api/players')
        .send(playerData2)
        .expect(409);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('PUT /api/players/:id', () => {
    test('should update player completely', async () => {
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
      const response = await request(app)
        .put('/api/players/1')
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstname).toBe('Updated');
      expect(response.body.data.lastname).toBe('Name');
      expect(response.body.data.country.code).toBe('ESP');
    });

    test('should return 404 for non-existent player', async () => {
      // Arrange
      const updateData = createPlayerData({ id: 999 });

      // Act
      const response = await request(app)
        .put('/api/players/999')
        .send(updateData)
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /api/players/:id', () => {
    test('should update player partially', async () => {
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
      const response = await request(app)
        .patch('/api/players/1')
        .send(partialUpdateData)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstname).toBe(partialUpdateData.firstname);
      expect(response.body.data.lastname).toBe(partialUpdateData.lastname);
    });

    test('should return 400 when trying to update ID', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act
      const response = await request(app)
        .patch('/api/players/1')
        .send({ id: 999 })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('cannot be modified');
    });
  });

  describe('DELETE /api/players/:id', () => {
    test('should delete player successfully', async () => {
      // Arrange
      const playerData = createPlayerData({ id: 1 });
      await Player.create(playerData);

      // Act
      const response = await request(app)
        .delete('/api/players/1')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('deleted successfully');
      
      // Verify deletion
      const deleted = await Player.findOne({ id: 1 });
      expect(deleted).toBeNull();
    });

    test('should return 404 for non-existent player', async () => {
      const response = await request(app)
        .delete('/api/players/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('Specialized Update Endpoints', () => {
    beforeEach(async () => {
      const playerData = createPlayerData({ 
        id: 1,
        data: {
          rank: 5,
          points: 1000,
          weight: 75000,
          height: 180,
          age: 25,
          last: [1, 0, 1, 0, 1]
        }
      });
      await Player.create(playerData);
    });

    describe('PATCH /api/players/:id/rank', () => {
      test('should update player rank only', async () => {
        const response = await request(app)
          .patch('/api/players/1/rank')
          .send({ rank: 1 })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.data.rank).toBe(1);
      });

      test('should return 400 for invalid rank', async () => {
        const response = await request(app)
          .patch('/api/players/1/rank')
          .send({ rank: -1 })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('positive number');
      });
    });

    describe('PATCH /api/players/:id/stats', () => {
      test('should update player stats only', async () => {
        const statsUpdate = {
          points: 2000,
          last: [1, 1, 1, 0, 0]
        };

        const response = await request(app)
          .patch('/api/players/1/stats')
          .send(statsUpdate)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.data.points).toBe(2000);
        expect(response.body.data.data.last).toEqual([1, 1, 1, 0, 0]);
      });

      test('should return 400 for invalid stats fields', async () => {
        const response = await request(app)
          .patch('/api/players/1/stats')
          .send({ invalidField: 'invalid' })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('No valid stats fields');
      });
    });
  });

  describe('Analytics Endpoints', () => {
    beforeEach(async () => {
      // Setup test data with complete player structure
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

    describe('GET /api/players/analytics/countries', () => {
      test('should return country win ratio analysis', async () => {
        const response = await request(app)
          .get('/api/players/analytics/countries')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('best');
        expect(response.body.data).toHaveProperty('worst');
        expect(Array.isArray(response.body.data.best)).toBe(true);
        expect(Array.isArray(response.body.data.worst)).toBe(true);
      });
    });

    describe('GET /api/players/analytics/bmi', () => {
      test('should return BMI analysis', async () => {
        const response = await request(app)
          .get('/api/players/analytics/bmi')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('average');
        expect(response.body.data).toHaveProperty('players');
        expect(Array.isArray(response.body.data.players)).toBe(true);
        expect(typeof response.body.data.average).toBe('number');
        
        // Check BMI calculation for each player
        response.body.data.players.forEach(player => {
          expect(player).toHaveProperty('bmi');
          expect(typeof player.bmi).toBe('number');
          expect(player.bmi).toBeGreaterThan(0);
        });
      });
    });

    describe('GET /api/players/analytics/height', () => {
      test('should return height statistics', async () => {
        const response = await request(app)
          .get('/api/players/analytics/height')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('min');
        expect(response.body.data).toHaveProperty('max');
        expect(response.body.data).toHaveProperty('average');
        expect(response.body.data).toHaveProperty('median');
        
        const { min, max, average, median } = response.body.data;
        expect(typeof min).toBe('number');
        expect(typeof max).toBe('number');
        expect(typeof average).toBe('number');
        expect(typeof median).toBe('number');
        
        expect(min).toBeLessThanOrEqual(max);
        expect(average).toBeGreaterThan(0);
        expect(median).toBeGreaterThan(0);
      });
    });

    test('all analytics endpoints should return 404 when no players exist', async () => {
      // Arrange - remove all players
      await Player.deleteMany({});

      // Act & Assert
      const endpoints = [
        '/api/players/analytics/countries',
        '/api/players/analytics/bmi',
        '/api/players/analytics/height'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('No players found');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle error for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      // Can be 400 or 404 depending on routing setup
      expect([400, 404]).toContain(response.status);
    });

    test('should return consistent error format', async () => {
      const response = await request(app)
        .get('/api/players/999')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        statusCode: 404,
        message: expect.stringContaining('not found')
      });
    });

    test('should handle validation errors consistently', async () => {
      const response = await request(app)
        .post('/api/players')
        .send({ invalidData: 'test' })
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBeDefined();
    });
  });
});