const client = require('./initRedis');

const storeRefreshToken = (userId, token) => {
  return new Promise((resolve, reject) => {
    client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err) => {
      if (err) {
        console.log(err.message);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const revokeRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    client.DEL(userId, (err, reply) => {
      if (err) {
        console.log(err.message);
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};

const getRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    client.get(userId, (err, refreshToken) => {
      if (err) {
        console.log(err.message);
        reject(err);
      } else {
        resolve(refreshToken);
      }
    });
  });
};

module.exports = {
  storeRefreshToken,
  revokeRefreshToken,
  getRefreshToken,
};
