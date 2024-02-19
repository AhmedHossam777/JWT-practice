const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');

const {
  registerUser,
  loginUser,
  getAllUsers,
  logout,
  refreshToken
} = require('../controllers/user');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.delete('/logout', logout);

router.post('/refresh-token/:id', refreshToken);

router.get('/', isLogin, getAllUsers);

module.exports = router;
