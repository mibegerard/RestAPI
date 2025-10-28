/**
 * Global error handler middleware
 */
const catchError = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        statusCode: 500,
        message: 'Internal Server Error',
        success: false
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        error.message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        error.statusCode = 400;
        error.message = 'Duplicate field value entered';
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        error.statusCode = 400;
        error.message = 'Resource not found';
    }
};

module.exports = catchError;