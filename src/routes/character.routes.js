const express = require('express');
const router = express.Router();
const Character = require('../models/character.model');

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

module.exports = router;
