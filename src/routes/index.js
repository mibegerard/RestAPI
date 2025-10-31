const express = require('express');
const playerRoutes = require('./playerRoutes');

const router = express.Router();

// =============================================================================
// API ROUTES
// =============================================================================

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Player routes
router.use('/players', playerRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to RestAPI',
    version: '1.0.0',
    endpoints: {
      players: '/api/players',
      health: '/api/health'
    }
  });
});

module.exports = router;