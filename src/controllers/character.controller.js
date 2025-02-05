const Character = require('../models/character.model');
const Quest = require('../models/quest.model');
const achievementController = require('./achievement.controller');

module.exports = {
  //  Создание нового персонажа
  createCharacter: async (req, res, next) => {
    try {
      const { name, class: characterClass } = req.body;
      const userId = req.user.id;

      if (!name || !characterClass) {
        return res.status(400).json({ error: 'Name and class are required' });
      }

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

  //  Удаление персонажа (только своих)
  deleteCharacter: async (req, res, next) => {
    try {
      const character = await Character.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      res.status(200).json({ message: 'Character deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  //  Обновление данных персонажа (только своих)
  updateCharacter: async (req, res, next) => {
    try {
      const { name, class: characterClass } = req.body;

      const character = await Character.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { name, class: characterClass },
        { new: true, runValidators: true },
      );

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },

  //  Повышение уровня персонажа
  levelUpCharacter: async (req, res, next) => {
    try {
      const character = await Character.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });
      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      character.levelUp();
      await character.save();

      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },

  //  Добавление опыта персонажу
  addExperience: async (req, res, next) => {
    try {
      const { experience } = req.body;
      const character = await Character.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      character.experience += experience;
      await character.save();

      await achievementController.checkAndAssignAchievements(character);
      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },

  //  Завершение задания персонажем
  completeQuest: async (req, res, next) => {
    try {
      const quest = await Quest.findById(req.params.questId);
      const character = await Character.findOne({
        _id: req.body.characterId,
        userId: req.user.id,
      });

      if (!quest) return res.status(404).json({ error: 'Quest not found' });
      if (!character)
        return res.status(404).json({ error: 'Character not found' });

      character.experience += quest.reward.experience;
      character.gold += quest.reward.gold;
      character.updateRating();

      await character.save();

      quest.status = 'completed';
      await quest.save();

      await achievementController.checkAndAssignAchievements(character);
      res
        .status(200)
        .json({ message: 'Quest completed successfully', character });
    } catch (err) {
      next(err);
    }
  },

  //  Получение списка только своих персонажей
  getCharacters: async (req, res, next) => {
    try {
      const characters = await Character.find({ userId: req.user.id });
      res.status(200).json(characters);
    } catch (err) {
      next(err);
    }
  },

  //  Получение рейтинга персонажей
  getLeaderboard: async (req, res, next) => {
    try {
      const characters = await Character.find()
        .populate('achievements')
        .sort({ rating: -1 });
      res.status(200).json({ leaderboard: characters });
    } catch (err) {
      next(err);
    }
  },

  //  Отображение страницы со списком персонажей
  renderCharacters: async (req, res, next) => {
    try {
      const characters = await Character.find({ userId: req.user.id }).populate(
        'achievements',
      );
      res.render('characters', { characters });
    } catch (err) {
      next(err);
    }
  },

  //  Отображение страницы с рейтингом персонажей
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
};
