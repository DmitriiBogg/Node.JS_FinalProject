const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quest title is required'],
    minlength: [3, 'Title must be at least 3 characters long'], //  Минимальная длина названия задания
  },
  description: {
    type: String,
    required: [true, 'Quest description is required'],
    minlength: [10, 'Description must be at least 10 characters long'], //  Минимальная длина описания задания
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Quest difficulty is required'],
  },
  reward: {
    gold: {
      type: Number,
      default: 0,
      min: [0, 'Reward gold cannot be negative'],
    },
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Reward experience cannot be negative'],
    },
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    default: null,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      comment: {
        type: String,
        default: '',
        maxlength: [500, 'Comment cannot exceed 500 characters'], //  Ограничение длины комментария
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Проверка, можно ли назначить задание
questSchema.methods.canAssignToCharacter = function () {
  return this.status === 'open' && this.assignedTo === null;
};

module.exports = mongoose.model('Quest', questSchema);
