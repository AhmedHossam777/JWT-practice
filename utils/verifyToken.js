const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
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
