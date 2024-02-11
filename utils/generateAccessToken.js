require('dotenv').config();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const generateAccessToken = async (user) => {
  const token = await signAccessToken(user._id);

  user.password = undefined;
  return token;
};

module.exports = {
  signAccessToken,
  generateAccessToken,
};  

