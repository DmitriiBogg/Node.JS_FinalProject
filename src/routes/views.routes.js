const express = require('express');
const router = express.Router();
// Подключение контроллеров
const characterController = require('../controllers/character.controller');
const questController = require('../controllers/quest.controller');
const achievementController = require('../controllers/achievement.controller');

// Главная страница
router.get('/', (req, res) => {
  res.render('index');
});

// Страница логина
router.get('/login', (req, res) => {
  res.render('login');
});

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register');
});

// Страница заданий
router.get('/quests', questController.renderQuests);

// Страница персонажей
router.get('/characters', characterController.renderCharacters);

// Страница достижений
router.get('/achievements', achievementController.renderAchievements);

module.exports = router;
