const { validationResult } = require('express-validator');

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Express middleware: converts express-validator results into a 400 error.
 */
function handleValidation(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', result.array()));
  }
  return next();
}

/**
 * Express error handler.
 */
function errorHandler(err, _req, res, _next) {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details,
    });
  }

  // Postgres unique violation, etc.
  if (err && err.code && typeof err.code === 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Database error',
      details: { code: err.code, constraint: err.constraint },
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
}

module.exports = {
  ApiError,
  handleValidation,
  errorHandler,
};
