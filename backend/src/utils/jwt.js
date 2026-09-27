const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET_KEY;
const EXPIRATION_HOURS = parseInt(process.env.JWT_EXPIRATION_HOURS || '24', 10);

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: `${EXPIRATION_HOURS}h` });
};

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload.sub;
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
