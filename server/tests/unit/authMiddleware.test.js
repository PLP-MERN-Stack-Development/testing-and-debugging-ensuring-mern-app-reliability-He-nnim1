const { authMiddleware } = require('../../src/utils/auth');
const { generateToken } = require('../../src/utils/auth');
const mongoose = require('mongoose');

function createMockReq(headers = {}) {
  return { headers };
}

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authMiddleware', () => {
  it('returns 401 when Authorization header missing', async () => {
    const req = createMockReq();
    const res = createMockRes();
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next and sets req.user when token is valid', async () => {
    const fakeUser = { _id: new mongoose.Types.ObjectId() };
    const token = generateToken(fakeUser);
    const req = createMockReq({ authorization: `Bearer ${token}` });
    const res = createMockRes();
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(fakeUser._id.toString());
  });
});
