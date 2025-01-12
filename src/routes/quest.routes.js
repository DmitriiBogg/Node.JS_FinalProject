const express = require('express');
const router = express.Router();
const Quest = require('../models/quest.model');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создать задание (доступно только для гильдмастера)
router.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
});

// Получить список всех заданий
router.get('/', authenticate, async (req, res) => {
  try {
    const quests = await Quest.find();
    res.status(200).json(quests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить задание по ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.status(200).json(quest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить задание (доступно только для гильдмастера)
router.delete(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const quest = await Quest.findByIdAndDelete(req.params.id);
      if (!quest) {
        return res.status(404).json({ error: 'Quest not found' });
      }
      res.status(200).json({ message: 'Quest deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);
// назначить задание персонажу
router.put('/assign/:questId', authenticate, async (req, res) => {
  try {
    const { characterId } = req.body;
    const quest = await Quest.findById(req.params.questId);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.status !== 'open') {
      return res.status(400).json({ error: 'Quest is not available.' });
    }

    quest.status = 'in-progress';
    quest.assignedTo = characterId; // Добавляем ID персонажа
    await quest.save();

    res.status(200).json(quest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// завершение задания персонажем
router.put('/complete/:questId', authenticate, async (req, res) => {
  try {
    const { characterId } = req.body;
    const quest = await Quest.findById(req.params.questId);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.status !== 'in-progress' || quest.assignedTo !== characterId) {
      return res
        .status(400)
        .json({ error: 'Quest cannot be completed by this character.' });
    }

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Добавление награды персонажу
    character.experience += quest.reward.experience;
    character.gold += quest.reward.gold;
    await character.save();

    // Обновление статуса задания
    quest.status = 'completed';
    await quest.save();

    res
      .status(200)
      .json({ message: 'Quest completed successfully', character, quest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/review/:questId', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const quest = await Quest.findById(req.params.questId);
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    // Проверка: задание должно быть завершено
    if (quest.status !== 'completed') {
      return res
        .status(400)
        .json({ error: 'Cannot leave a review for an incomplete quest.' });
    }

    // Добавление отзыва
    quest.reviews.push({
      userId: req.user.id,
      rating,
      comment,
    });

    await quest.save();
    res.status(201).json({ message: 'Review added successfully', quest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reviews/:questId', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.questId).populate(
      'reviews.userId',
      'email',
    );
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    res.status(200).json(quest.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
