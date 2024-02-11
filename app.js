require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const authRoutes = require('./routes/auth');
const connectDB = require('./utils/connectDB');

const app = express();

app.use(morgan('dev')); // log requests
app.use(express.json());

// Routes
app.use('/auth', authRoutes);


app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  
  if (err.name === 'ValidationError') {
    err.status = 422;
  }
  

  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, async() => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
