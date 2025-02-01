const Character = require('../models/character.model');
const Quest = require('../models/quest.model');
const achievementController = require('./achievement.controller');

module.exports = {
  createCharacter: async (req, res, next) => {
    try {
      const { name, class: characterClass } = req.body;
      const userId = req.user.id;
      const newCharacter = await Character.create({
        name,
        class: characterClass,
        userId,
      });
      res.status(201).json(newCharacter);
    } catch (err) {
      next(err);
    }
  },
  levelUpCharacter: async (req, res, next) => {
    try {
      const character = await Character.findById(req.params.id);

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      if (typeof character.levelUp !== 'function') {
        return res.status(500).json({ error: 'Invalid character instance' });
      }

      character.levelUp(); // Вызов метода повышения уровня
      await character.save();

      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },

  completeQuest: async (req, res, next) => {
    try {
      const quest = await Quest.findById(req.params.questId);
      if (!quest) return res.status(404).json({ error: 'Quest not found' });

      const character = await Character.findById(req.body.characterId);
      if (!character)
        return res.status(404).json({ error: 'Character not found' });

      character.experience += quest.reward.experience;
      character.gold += quest.reward.gold;

      character.updateRating();
      await character.save();

      quest.status = 'completed';
      await quest.save();

      await achievementController.checkAndAssignAchievements(character); // проверка и назначение достижений
      res
        .status(200)
        .json({ message: 'Quest completed successfully', character });
    } catch (err) {
      next(err);
    }
  },
  getLeaderboard: async (req, res, next) => {
    try {
      const characters = await Character.find()
        .populate('achievements') // достижения
        .sort({ rating: -1 }); // Сортировка по рейтингу, от большего к меньшему

      res.status(200).json({ leaderboard: characters });
    } catch (err) {
      next(err);
    }
  },

  getCharacters: async (req, res, next) => {
    try {
      const characters = await Character.find(); // Извлечение всех персонажей
      res.status(200).json(characters);
    } catch (err) {
      next(err);
    }
  },
  renderCharacters: async (req, res, next) => {
    try {
      const characters = await Character.find().populate('achievements');
      res.render('characters', { characters });
    } catch (err) {
      next(err);
    }
  },
  renderLeaderboard: async (req, res, next) => {
    try {
      const characters = await Character.find()
        .populate('achievements')
        .sort({ rating: -1 });

      res.render('leaderboard', { characters });
    } catch (err) {
      next(err);
    }
  },

  deleteCharacter: async (req, res, next) => {
    try {
      const { id } = req.params;
      const character = await Character.findByIdAndDelete(id);

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      res.status(200).json({ message: 'Character deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
  addExperience: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { experience } = req.body;

      const character = await Character.findById(id);
      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      character.experience += experience;
      await character.save();

      await achievementController.checkAndAssignAchievements(character); // тоже проверка и назначение достижений

      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },
  updateCharacter: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, class: characterClass } = req.body;

      const character = await Character.findByIdAndUpdate(
        id,
        { name, class: characterClass },
        { new: true, runValidators: true }, // Возвращаем обновлённый документ и проверяем валидацию
      );

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },
};
