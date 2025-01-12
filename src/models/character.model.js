const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Автоматическое повышение уровня при достижении опыта
characterSchema.methods.levelUp = function () {
  console.log(
    `Before Level Up: Level - ${this.level}, Experience - ${this.experience}`,
  );
  if (this.experience >= 1000) {
    this.level += 1;
    this.experience -= 1000;
  }
  console.log(
    `After Level Up: Level - ${this.level}, Experience - ${this.experience}`,
  );
};

module.exports = mongoose.model('Character', characterSchema);
