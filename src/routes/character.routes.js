const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');
const { addExperience } = require('../controllers/character.controller');

// Создание нового персонажа
router.post('/create', authenticate, characterController.createCharacter);

// Удаление персонажа по ID
router.delete('/:id', authenticate, characterController.deleteCharacter);
// Обновление имени персонажа
router.put('/:id', authenticate, characterController.updateCharacterName);

// Получение списка всех персонажей
router.get('/', authenticate, characterController.getCharacters);

// Получение рейтинга персонажей
router.get('/leaderboard', characterController.getLeaderboard);

// Отображение страницы со списком персонажей
router.get('/view', authenticate, characterController.renderCharacters);

// Отображение страницы с рейтингом персонажей
router.get('/leaderboard/view', characterController.renderLeaderboard);

// Взять квест
router.post(
  '/:id/quests/:questId',
  authenticate,
  characterController.takeQuest,
);

// Завершить квест
router.post(
  '/:id/quests/:questId/complete',
  authenticate,
  characterController.completeQuest,
);

module.exports = router;
