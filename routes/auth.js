const express = require('express');
const router = express.Router();

router.post('/register', (req, res, next) => {
  res.send('Register');
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

module.exports = router;
