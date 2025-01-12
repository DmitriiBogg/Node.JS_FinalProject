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

module.exports = router;
