const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res) => {
  let error = { ...err };
  error.message = err.message;

  /**
   * !MONGO duplicate KEY
   */
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  /**
   * !MONGO VALIDATION error
   */

  if (err.code === 121) {
    const message = 'Validation error';
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
