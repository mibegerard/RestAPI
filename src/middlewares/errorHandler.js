const { AppError, ValidationError, NotFoundError, ConflictError } = require('../utils/appError');
const logger = require('../helper/logger');

/**
 * Global error handling middleware
 * Captures all thrown or unhandled errors and returns a clean JSON response.
 */
function errorHandler(err, req, res, next) {
  // Default fallback
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle unexpected non-AppError exceptions 
  if (!(err instanceof AppError)) {
    statusCode = 500;
    message = 'Something went wrong on the server.';
  }

  // Log errors with appropriate level based on type
  if (process.env.NODE_ENV !== 'test') {
    if (err instanceof ValidationError) {
      logger.warn(`[${req.method}] ${req.originalUrl} - Validation: ${message}`);
    } else if (err instanceof NotFoundError) {
      logger.info(`[${req.method}] ${req.originalUrl} - Not Found: ${message}`);
    } else if (err instanceof ConflictError) {
      logger.warn(`[${req.method}] ${req.originalUrl} - Conflict: ${message}`);
    } else if (err instanceof AppError) {
      logger.error(`[${req.method}] ${req.originalUrl} - ${message}`);
    } else {
      // System errors (already handled above)
      logger.error(`[${req.method}] ${req.originalUrl} - System Error: ${message}`);
      logger.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}

module.exports = errorHandler;