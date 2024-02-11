const createError = require('http-errors');
const User = require('../models/User');
const { generateAccessToken } = require('../utils/generateAccessToken');

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
  const token = await generateAccessToken(user);

  res.status(201).json({
    status: 'success',
    user,
    token,
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
  const token = await generateAccessToken(user);

  res.status(200).json({
    status: 'success',
    user,
    token,
  });
};

const refreshToken = (req, res, next) => {
  res.send('Refresh Token');
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

module.exports = { registerUser, loginUser, getAllUsers, refreshToken, logout };
