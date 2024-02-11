const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');

const { registerUser, loginUser, getAllUsers } = require('../controllers/user');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/refresh-token', (req, res, next) => {
  res.send('Refresh Token');
});

router.delete('/logout', (req, res, next) => {
  res.send('Logout');
});

router.get('/', isLogin,getAllUsers);

module.exports = router;
