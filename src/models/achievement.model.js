const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  criteria: { type: String, enum: ['level', 'quests', 'gold'], required: true },
  threshold: { type: Number, required: true }, // Например, 10 уровней или 100 золота
  reward: {
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('Achievement', achievementSchema);
