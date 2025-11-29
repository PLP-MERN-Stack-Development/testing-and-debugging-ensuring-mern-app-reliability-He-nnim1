const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'testsecret';

function generateToken(user) {
  const payload = { id: user._id ? user._id.toString() : user.id };
  return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
};
