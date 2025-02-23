const Quest = require('../models/quest.model');
const Character = require('../models/character.model');

module.exports = {
  //  Получение списка всех заданий
  getAllQuests: async (req, res, next) => {
    try {
      const quests = await Quest.find();
      res.status(200).json(quests);
    } catch (err) {
      next(err);
    }
  },

  //  Получение задания по ID
  getQuestById: async (req, res, next) => {
    try {
      const quest = await Quest.findById(req.params.id);
      if (!quest) return res.status(404).json({ error: 'Quest not found' });
      res.status(200).json(quest);
    } catch (err) {
      next(err);
    }
  },

  //  Обновление статуса задания
  updateQuestStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const quest = await Quest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true },
      );
      if (!quest) return res.status(404).json({ error: 'Quest not found' });
      res
        .status(200)
        .json({ message: 'Quest status updated successfully', quest });
    } catch (err) {
      next(err);
    }
  },
  // Метод для взятия задания (front)
  takeQuest: async (req, res, next) => {
    try {
      const { id } = req.params; // ID квеста из URL
      const { characterId } = req.body; // ID выбранного персонажа

      if (!characterId) {
        req.flash('error', 'Please select a character.');
        return res.redirect('/characters/view');
      }

      const quest = await Quest.findById(id);
      if (!quest) {
        req.flash('error', 'Quest not found.');
        return res.redirect('/characters/view');
      }

      const character = await Character.findOne({
        _id: characterId,
        userId: req.user.id,
      });
      if (!character) {
        req.flash('error', 'Character not found.');
        return res.redirect('/characters/view');
      }

      // Проверяем, выполняет ли персонаж этот квест прямо сейчас
      if (character.quests.includes(id) && quest.status !== 'completed') {
        req.flash('error', 'You are already doing this quest.');
        return res.redirect('/characters/view');
      }

      character.quests.push(id);
      await character.save();

      req.flash('success', 'Quest successfully taken!');
      res.redirect('/characters/view');
    } catch (err) {
      next(err);
    }
  },

  //  Добавление отзыва к заданию
  addReview: async (req, res, next) => {
    try {
      const { questId } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: 'Rating must be between 1 and 5.' });
      }

      const quest = await Quest.findById(questId);
      if (!quest) return res.status(404).json({ error: 'Quest not found.' });

      if (quest.status !== 'completed') {
        return res
          .status(400)
          .json({ error: 'Cannot review an incomplete quest.' });
      }

      quest.reviews.push({ userId: req.user.id, rating, comment });
      await quest.save();

      res.status(201).json({ message: 'Review added successfully.', quest });
    } catch (err) {
      next(err);
    }
  },

  // Отображение страницы с заданиями
  renderQuests: async (req, res, next) => {
    try {
      const quests = await Quest.find();
      res.render('quests', { quests });
    } catch (err) {
      next(err);
    }
  },
  deleteQuest: async (req, res) => {
    try {
      const { id } = req.params;

      const quest = await Quest.findByIdAndDelete(id);

      if (!quest) {
        return res.status(404).json({ error: 'Quest not found' });
      }

      req.flash('success', 'Quest deleted successfully');
      res.redirect('/admin/view');
    } catch (err) {
      req.flash('error', 'Failed to delete quest');
      res.redirect('/admin/view');
    }
  },
};
