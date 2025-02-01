const Quest = require('../models/quest.model');

module.exports = {
  createQuest: async (req, res, next) => {
    try {
      const { title, description, difficulty, reward } = req.body;
      const newQuest = await Quest.create({
        title,
        description,
        difficulty,
        reward,
      });
      res.status(201).json(newQuest);
    } catch (err) {
      next(err);
    }
  },
  getAllQuests: async (req, res, next) => {
    try {
      const quests = await Quest.find();
      res.status(200).json(quests);
    } catch (err) {
      next(err);
    }
  },
  getQuestById: async (req, res, next) => {
    try {
      const quest = await Quest.findById(req.params.id);
      if (!quest) return res.status(404).json({ error: 'Quest not found' });

      res.status(200).json(quest);
    } catch (err) {
      next(err);
    }
  },
  renderQuests: async (req, res, next) => {
    try {
      const quests = await Quest.find();
      console.log('Fetched quests:', quests);
      res.render('quests', { quests });
    } catch (err) {
      next(err);
    }
  },
  updateQuestStatus: async (req, res, next) => {
    try {
      const { status } = req.body; // Новый статус передаётся в теле запроса
      const quest = await Quest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }, // Возвращает обновлённый документ
      );

      if (!quest) {
        return res.status(404).json({ error: 'Quest not found' });
      }

      res
        .status(200)
        .json({ message: 'Quest status updated successfully', quest });
    } catch (err) {
      next(err);
    }
  },
  assignQuestToCharacter: async (req, res, next) => {
    try {
      const { questId, characterId } = req.body;

      // Проверка переданы ли questId и characterId
      if (!questId || !characterId) {
        return res
          .status(400)
          .json({ error: 'Quest ID and Character ID are required' });
      }

      // Проверка существует ли задание
      const quest = await Quest.findById(questId);
      if (!quest) {
        return res.status(404).json({ error: 'Quest not found' });
      }

      // Проверка существует ли персонаж
      const character = await Character.findById(characterId);
      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      // Проверка можно ли назначить задание
      if (quest.assignedTo) {
        return res
          .status(401)
          .json({ error: 'Quest already assigned to another character' });
      }

      quest.assignedTo = characterId;
      quest.status = 'in-progress';
      await quest.save();

      res
        .status(200)
        .json({ message: 'Quest successfully assigned to character', quest });
    } catch (err) {
      next(err);
    }
  },

  addReview: async (req, res, next) => {
    try {
      const { questId } = req.params;
      const { rating, comment } = req.body;

      // Проверка входных данных
      if (!rating || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: 'Rating must be between 1 and 5.' });
      }

      const quest = await Quest.findById(questId);
      if (!quest) {
        return res.status(404).json({ error: 'Quest not found.' });
      }

      //Проверка завершено ли задание
      if (quest.status !== 'completed') {
        return res
          .status(400)
          .json({ error: 'Cannot leave a review for an incomplete quest.' });
      }

      // Добавляем отзыв
      quest.reviews.push({
        userId: req.user.id, // Идентификатор текущего пользователя
        rating,
        comment,
      });

      await quest.save();

      res.status(201).json({ message: 'Review added successfully.', quest });
    } catch (err) {
      next(err);
    }
  },
};
