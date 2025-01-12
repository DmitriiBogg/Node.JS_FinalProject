const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  rating: { type: Number, default: 0 },
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
  // потом можно убрать. (для нахождения проблемы)
  console.log(
    `After Level Up: Level - ${this.level}, Experience - ${this.experience}`,
  );
};
// Рэйтинг персонажей этих уважаемых
characterSchema.methods.updateRating = function () {
  // Рейтинг зависит от уровня, количества достижений и опыта
  this.rating =
    this.level * 10 +
    this.achievements.length * 5 +
    Math.floor(this.experience / 100);
};

module.exports = mongoose.model('Character', characterSchema);
