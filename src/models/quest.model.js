const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  reward: { gold: Number, experience: Number },
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
});

// Проверка, можно ли взять задание
questSchema.methods.canAssignToCharacter = function () {
  return this.status === 'open';
};

module.exports = mongoose.model('Quest', questSchema);
