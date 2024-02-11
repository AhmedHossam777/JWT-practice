const express = require('express');
const User = require('../models/User');
const router = express.Router();
const createError = require('http-errors');
const { generateAccessToken } = require('../utils/generateAccessToken');

router.post('/register', async (req, res, next) => {
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
});

router.post('/login', async (req, res, next) => {
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
});

router.post('/refresh-token', (req, res, next) => {
  res.send('Refresh Token');
});

router.delete('/logout', (req, res, next) => {
  res.send('Logout');
});

router.get('/', async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(createError(404, 'No users found'));
  }
  res.status(200).json({
    status: 'success',
    users,
  });
});

module.exports = router;
