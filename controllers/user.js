const createError = require('http-errors');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateTokens.js');
const verifyToken = require('../utils/verifyToken');
const jwtRedis = require('../utils/jwtRedis.js');

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

  res.cookie('access_token', token, {
    httpOnly: true, // Prevent access from client-side scripts
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
  });

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
  console.log(isMatch);
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
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return next(createError(400, 'Refresh token is required'));
    }

    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    const storedRefreshToken =await jwtRedis.getRefreshToken(userId);
    console.log(storedRefreshToken);

    if (refreshToken !== storedRefreshToken) {
      return next(createError(400, 'Refresh token is Wrong!!'));
    }

    const newAccessToken = await generateAccessToken(user);

    res.status(200).json({
      status: 'success',
      user,
      newAccessToken,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Send a generic error response to the client
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request.',
    });
  }
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
