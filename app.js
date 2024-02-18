require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const authRoutes = require('./routes/auth');
const connectDB = require('./utils/connectDB');
const cookieParser = require('cookie-parser');
const redisClient = require('./utils/initRedis');

redisClient.SET('name', 'Ahmed');

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));

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

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  redisClient.quit(() => {
    console.log('Redis client disconnected');
    process.exit(0);
  });
});
