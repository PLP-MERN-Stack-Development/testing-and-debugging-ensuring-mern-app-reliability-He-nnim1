function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);

  // Mongoose cast/validation handling
  if (err && err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
