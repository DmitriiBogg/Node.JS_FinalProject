const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Character name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      trim: true,
    },
    class: {
      type: String,
      required: [true, 'Character class is required'],
      enum: ['Warrior', 'Mage', 'Ranger'],
    },
    level: {
      type: Number,
      default: 1,
      min: [1, 'Level cannot be less than 1'],
      max: [100, 'Level cannot exceed 100'],
    },
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    gold: {
      type: Number,
      default: 0,
      min: [0, 'Gold cannot be negative'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
      },
    ],
    quests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
    },
    completedQuests: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// Метод для повышения уровня персонажа
characterSchema.methods.levelUp = function () {
  let leveledUp = false;
  while (this.experience >= 1000 && this.level < 100) {
    this.level += 1;
    this.experience -= 1000;
    leveledUp = true;
  }
};

// Метод для добавления опыта и автоматического повышения уровня
characterSchema.methods.gainExperience = async function (xp) {
  this.experience += xp;
  this.levelUp();
  await this.save();
};

// Метод для обновления рейтинга персонажа
characterSchema.methods.updateRating = function () {
  this.rating =
    this.level * 10 +
    (this.achievements ? this.achievements.length * 5 : 0) +
    Math.floor(this.experience / 100);
};

module.exports = mongoose.model('Character', characterSchema);
