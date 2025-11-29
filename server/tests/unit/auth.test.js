const { generateToken, verifyToken } = require('../../src/utils/auth');
const mongoose = require('mongoose');

describe('Auth util', () => {
  it('generates and verifies a token', () => {
    const fakeUser = { _id: new mongoose.Types.ObjectId() };
    const token = generateToken(fakeUser);
    const payload = verifyToken(token);
    expect(payload).toHaveProperty('id');
    expect(payload.id).toBe(fakeUser._id.toString());
  });
});
