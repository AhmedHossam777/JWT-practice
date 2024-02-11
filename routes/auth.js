const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');

const {
  registerUser,
  loginUser,
  getAllUsers,
  refreshToken,
  logout,
} = require('../controllers/user');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/refresh-token', refreshToken);

router.delete('/logout', logout);

router.get('/', isLogin, getAllUsers);

module.exports = router;
