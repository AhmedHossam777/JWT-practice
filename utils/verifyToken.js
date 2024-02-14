const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET;
  const decoded = jwt.verify(
    token,
    secret,
    (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return 'TokenExpiredError';
        }

        return false;
      }
      return decoded;
    }
  );
  return decoded;
};

module.exports = verifyToken;
