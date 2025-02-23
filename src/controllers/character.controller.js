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
      res.redirect('/characters/view');
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
      req.flash('success', 'Character deleted successfully');
      res.redirect('/characters/view');
    } catch (err) {
      next(err);
    }
  },

  //  Обновление данных персонажа
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
      character.level += 1;
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
      res.status(200).json(character);
    } catch (err) {
      next(err);
    }
  },

  //  Взять квест персонажем
  takeQuest: async (req, res, next) => {
    try {
      const { id, questId } = req.params;
      const character = await Character.findOne({
        _id: id,
        userId: req.user.id,
      });
      if (!character) {
        return res
          .status(403)
          .json({ message: 'Character not found or does not belong to user' });
      }
      if (character.quests.includes(questId)) {
        return res.status(400).json({ message: 'Quest already taken' });
      }
      console.log('Before adding quest:', character.quests);
      character.quests = [...character.quests, quest._id];
      await character.save();
      console.log('After adding quest:', character.quests);
      res.json({ message: 'Quest successfully taken!', character });
    } catch (err) {
      next(err);
    }
  },

  //  Завершить квест
  completeQuest: async (req, res, next) => {
    try {
      const { id, questId } = req.params;
      const character = await Character.findOne({
        _id: id,
        userId: req.user.id,
      });
      if (!character) {
        return res
          .status(403)
          .json({ message: 'Character not found or does not belong to user' });
      }
      if (!character.quests.includes(questId)) {
        return res
          .status(400)
          .json({ message: 'Quest not found in character quests' });
      }
      const quest = await Quest.findById(questId);
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }
      // Выдача награды
      character.experience += quest.reward.experience;
      character.gold += quest.reward.gold;
      character.quests = character.quests.filter(
        (q) => q.toString() !== questId,
      );
      await character.save();
      res.json({ message: 'Quest completed successfully', character });
    } catch (err) {
      next(err);
    }
  },

  //  Получение списка только своих персонажей
  getCharacters: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }
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
      console.log(
        'Rendering characters.ejs for user:',
        req.user ? req.user.id : 'No user!',
      );
      const characters = await Character.find({ userId: req.user.id })
        .populate('quests')
        .populate('achievements');
      const quests = await Quest.find({});
      res.render('characters', { characters, quests });
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
