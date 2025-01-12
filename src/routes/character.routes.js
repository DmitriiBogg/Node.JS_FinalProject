const express = require('express');
const router = express.Router();
const Character = require('../models/character.model');
const { authenticate } = require('../middlewares/auth.middleware');

// Создать персонажа
router.post('/', async (req, res) => {
  try {
    const { name, class: characterClass, userId } = req.body;
    const newCharacter = await Character.create({
      name,
      class: characterClass,
      userId,
    });
    res.status(201).json(newCharacter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/level-up/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character)
      return res.status(404).json({ error: 'Character not found' });

    character.levelUp();
    await character.save();

    res.status(200).json(character);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавить опыт персонажу
router.put('/add-experience/:id', async (req, res) => {
  try {
    const { experience } = req.body; // количество опыта в теле запроса
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    character.experience += experience;
    await character.save();

    res.status(200).json(character);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// добавить автоматическое достижение персонажу
router.put('/complete-quest/:questId', authenticate, async (req, res) => {
  try {
    const { characterId } = req.body;
    const quest = await Quest.findById(req.params.questId);
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const character = await Character.findById(characterId);
    if (!character)
      return res.status(404).json({ error: 'Character not found' });

    // Награда за выполнение задания
    character.experience += quest.reward.experience;
    character.gold += quest.reward.gold;

    // Проверка достижений
    const achievements = await Achievement.find();
    for (const achievement of achievements) {
      if (
        !character.achievements.includes(achievement._id) && // Если достижение ещё не присвоено
        achievement.criteria === 'gold' &&
        character.gold >= achievement.threshold
      ) {
        character.achievements.push(achievement._id);
      }
    }
    // Обновление рейтинга
    character.updateRating();

    await character.save();

    quest.status = 'completed';
    await quest.save();

    res
      .status(200)
      .json({ message: 'Quest completed successfully', character });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить список персонажей по рейтингу
router.get('/leaderboard', async (req, res) => {
  try {
    const characters = await Character.find().sort({ rating: -1 });
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
