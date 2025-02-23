const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email'], //  Валидация для email
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'], //  Минимальная длина пароля
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
  },
  { timestamps: true },
);
// проверка пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model('User', userSchema);
