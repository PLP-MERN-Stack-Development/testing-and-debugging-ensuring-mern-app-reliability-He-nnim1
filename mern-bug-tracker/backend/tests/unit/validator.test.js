const { validateBugPayload } = require('../../src/utils/validator');

describe('validateBugPayload', () => {
  test('returns invalid for non-object payload', () => {
    expect(validateBugPayload(null).valid).toBe(false);
  });

  test('requires title', () => {
    const { valid, errors } = validateBugPayload({});
    expect(valid).toBe(false);
    expect(errors).toContain('Title is required');
  });

  test('accepts correct payload', () => {
    const { valid, errors } = validateBugPayload({ title: 'Bug A', status: 'open' });
    expect(valid).toBe(true);
    expect(errors.length).toBe(0);
  });
});
