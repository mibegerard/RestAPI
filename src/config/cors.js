const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Allow multiple origins defined in .env
const allowedOrigins = [
  process.env.ORIGIN,
  process.env.ORIGIN2,
].filter(Boolean); // remove undefined values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`❌ Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow cookies / Authorization headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 200, // For legacy browsers
  preflightContinue: false, // Pass control to next handler
  maxAge: 86400, // Cache preflight response for 24 hours
};

// Export configured CORS middleware
module.exports = cors(corsOptions);