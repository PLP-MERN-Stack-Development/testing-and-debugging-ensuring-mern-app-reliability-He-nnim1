const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // Log full error with stack
  logger.error('Unhandled error: %O', err);

  // Normalize common Mongoose / Mongo errors to appropriate 4xx responses
  if (err && err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message || 'Validation error' });
  }

  // Mongo duplicate key error (e.g. unique index)
  if (err && (err.code === 11000 || err.code === '11000')) {
    return res.status(409).json({ error: 'Duplicate key error' });
  }

  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
