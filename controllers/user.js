const createError = require('http-errors');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateTokens.js');
const verifyToken = require('../utils/verifyToken');

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const isUserExist = await User.findOne({ email: email });

  if (isUserExist) {
    return next(createError(400, 'User already exists'));
  }

  const user = await User.create({
    email: email,
    password: password,
  });

  await user.save();
  const [token, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  res.status(201).json({
    status: 'success',
    user,
    token,
    refreshToken,
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(createError(401, 'Invalid email or password'));
  }

  const [token, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  res.status(200).json({
    status: 'success',
    user,
    token,
    refreshToken,
  });
};

const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next(createError(400, 'Refresh token is required'));
  }

  const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!decoded || decoded === 'TokenExpiredError') {
    return next(createError(401, 'Invalid refresh token'));
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const [newToken, newRefreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  res.status(200).json({
    status: 'success',
    user,
    token: newToken,
    refreshToken: newRefreshToken,
  });
};

const logout = (req, res, next) => {
  res.send('Logout');
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(createError(404, 'No users found'));
  }
  res.status(200).json({
    status: 'success',
    users,
  });
};

module.exports = { registerUser, loginUser, getAllUsers, logout, refreshToken };
