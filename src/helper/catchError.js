/**
 * Wrap async controller functions to automatically catch errors
 * and forward them to Express's error handler.
 *
 * Keeps controllers clean (no try/catch everywhere).
 */
const catchError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchError;
