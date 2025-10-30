const morgan = require('morgan');
const logger = require('../helper/logger');

const stream = {
  write: (message) => {
    // Remove trailing newline from Morgan's message
    logger.info(message.trim());
  }
};

// Define custom token for response time with color coding
morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;
  const color = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢';
  return `${color} ${status}`;
});

// Define custom token for request duration
morgan.token('response-time-colored', (req, res) => {
  const responseTime = parseFloat(morgan['response-time'](req, res));
  if (responseTime > 1000) return `⏱️  ${responseTime}ms`; // Slow
  if (responseTime > 500) return `⏱️  ${responseTime}ms`;  // Medium
  return `⚡ ${responseTime}ms`; // Fast
});

// Custom format for development (detailed)
const devFormat = ':method :url :colored-status :response-time-colored - :remote-addr';

// Custom format for production (concise)
const prodFormat = ':remote-addr - :method :url :status :response-time ms';

// Choose format based on environment
const morganFormat = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;

// Create Morgan middleware
const requestLogger = morgan(morganFormat, { stream });

// Skip logging for health check endpoints (optional)
const skipHealthChecks = morgan(morganFormat, {
  stream,
  skip: (req) => req.url === '/health' || req.url === '/api/health'
});

module.exports = {
  requestLogger,        
  skipHealthChecks      
};