const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement.model');
const Character = require('../models/character.model');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создать достижение (только для админов)
router.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { title, description, criteria, threshold, reward } = req.body;
    const achievement = await Achievement.create({
      title,
      description,
      criteria,
      threshold,
      reward,
    });
    res.status(201).json(achievement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить список достижений
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Присвоить достижение персонажу
router.put('/assign/:achievementId', authenticate, async (req, res) => {
  try {
    const { characterId } = req.body;
    const achievement = await Achievement.findById(req.params.achievementId);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (character.achievements.includes(req.params.achievementId)) {
      return res
        .status(400)
        .json({ error: 'Achievement already assigned to this character.' });
    }

    character.achievements.push(req.params.achievementId);
    await character.save();

    res
      .status(200)
      .json({ message: 'Achievement assigned successfully', character });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
