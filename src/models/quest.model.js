const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  reward: {
    gold: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
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
      rating: { type: Number, required: true, min: 1, max: 5 }, // Рейтинг от 1 до 5
      comment: { type: String, default: '' }, // Текст отзыва
      date: { type: Date, default: Date.now },
    },
  ],
});

// Проверка, можно ли взять задание
questSchema.methods.canAssignToCharacter = function () {
  return this.status === 'open' && this.assignedTo === null;
};

module.exports = mongoose.model('Quest', questSchema);
