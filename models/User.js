const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, 'Invalid Email'],
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [3, 'Password must be at least 3 characters long'],
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('user', userSchema);
module.exports = User;
