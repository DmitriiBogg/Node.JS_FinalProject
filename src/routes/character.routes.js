const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создание нового персонажа
router.post('/create', authenticate, characterController.createCharacter);

// Удаление персонажа по ID
router.delete('/:id', authenticate, characterController.deleteCharacter);

// Обновление данных персонажа по ID
router.put('/:id', authenticate, characterController.updateCharacter);

// Повышение уровня персонажа
router.put('/level-up/:id', authenticate, characterController.levelUpCharacter);

// Добавление опыта персонажу
router.put(
  '/add-experience/:id',
  authenticate,
  characterController.addExperience,
);

// Завершение задания персонажем
router.put(
  '/complete-quest/:questId',
  authenticate,
  characterController.completeQuest,
);

// Получение списка всех персонажей
router.get('/', authenticate, characterController.getCharacters);

// Получение рейтинга персонажей
router.get('/leaderboard', characterController.getLeaderboard);

// Отображение страницы со списком персонажей
router.get('/view', authenticate, characterController.renderCharacters);

// Отображение страницы с рейтингом персонажей
router.get('/leaderboard/view', characterController.renderLeaderboard);

module.exports = router;
