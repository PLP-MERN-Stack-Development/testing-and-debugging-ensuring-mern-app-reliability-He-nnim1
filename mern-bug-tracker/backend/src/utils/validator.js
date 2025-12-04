function validateBugPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('Invalid payload');
    return { valid: false, errors };
  }
  if (!payload.title || String(payload.title).trim() === '') errors.push('Title is required');
  if (payload.status && !['open', 'in-progress', 'resolved'].includes(payload.status)) errors.push('Invalid status');
  return { valid: errors.length === 0, errors };
}

module.exports = { validateBugPayload };
