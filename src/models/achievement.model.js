const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    minlength: [3, 'Title must be at least 3 characters long'], //  Минимальная длина названия
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    minlength: [5, 'Description must be at least 5 characters long'], //  Минимальная длина описания
  },
  criteria: {
    type: String,
    enum: ['level', 'quests', 'gold'],
    required: [true, 'Achievement criteria is required'],
  },
  threshold: {
    type: Number,
    required: [true, 'Threshold is required'],
    min: [1, 'Threshold must be at least 1'], // Минимальное значение порога
  },
  reward: {
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Reward experience cannot be negative'],
    },
    gold: {
      type: Number,
      default: 0,
      min: [0, 'Reward gold cannot be negative'],
    },
  },
});

module.exports = mongoose.model('Achievement', achievementSchema);
