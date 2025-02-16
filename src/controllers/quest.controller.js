const Quest = require('../models/quest.model');
const Character = require('../models/character.model');

module.exports = {
  //  Создание нового задания
  createQuest: async (req, res, next) => {
    try {
      const { title, description, difficulty, reward } = req.body;

      if (!title || title.length < 3) {
        req.flash('error', 'Title must be at least 3 characters long');
        return res.redirect('/admin/view');
      }
      if (!description || description.length < 10) {
        req.flash('error', 'Description must be at least 10 characters long');
        return res.redirect('/admin/view');
      }

      const newQuest = await Quest.create({
        title,
        description,
        difficulty,
        reward,
      });

      req.flash('success', 'Quest created successfully');
      res.redirect('/admin/view');
    } catch (err) {
      req.flash('error', 'Failed to create quest');
      res.redirect('/admin/view');
    }
  },

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
      const userId = req.user.id; // ID текущего пользователя

      // Найти квест
      const quest = await Quest.findById(id);
      if (!quest) {
        req.flash('error', 'Quest not found.');
        return res.redirect('/quests/view');
      }

      // Найти персонажа пользователя
      const character = await Character.findOne({ userId });
      if (!character) {
        req.flash('error', 'Character not found.');
        return res.redirect('/quests/view');
      }

      // Проверяем, не взят ли уже этот квест
      if (character.activeQuests.includes(id)) {
        req.flash('error', 'You have already taken this quest.');
        return res.redirect('/quests/view');
      }

      // Добавляем квест в список активных
      character.activeQuests.push(id);
      await character.save();

      req.flash('success', 'Quest successfully taken!');
      res.redirect('/quests/view');
    } catch (err) {
      next(err);
    }
  },
  // Назначение задания персонажу
  assignQuestToCharacter: async (req, res, next) => {
    try {
      const { questId, characterId } = req.body;
      if (!questId || !characterId) {
        return res
          .status(400)
          .json({ error: 'Quest ID and Character ID are required' });
      }

      const quest = await Quest.findById(questId);
      const character = await Character.findById(characterId);

      if (!quest) return res.status(404).json({ error: 'Quest not found' });
      if (!character)
        return res.status(404).json({ error: 'Character not found' });

      if (quest.assignedTo) {
        return res.status(400).json({ error: 'Quest already assigned' });
      }

      quest.assignedTo = characterId;
      quest.status = 'in-progress';
      await quest.save();

      res.status(200).json({ message: 'Quest assigned successfully', quest });
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
};
