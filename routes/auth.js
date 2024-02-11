const express = require('express');
const User = require('../models/User');
const router = express.Router();
const createError = require('http-errors');
const authSchema = require('../utils/validateSchema');
const { generateAccessToken } = require('../utils/generateAccessToken');

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authSchema.validateAsync({ email, password });

  const isUserExist = await User.findOne({ email: result.email });

  if (isUserExist) {
    return next(createError(400, 'User already exists'));
  }

  const user = await User.create({
    email: result.email,
    password: result.password,
  });

  await user.save();
  const token = await generateAccessToken(user);

  res.status(201).json({
    status: 'success',
    user,
    token,
  });
});

router.post('/login', (req, res, next) => {
  res.send('Login');
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
