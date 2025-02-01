const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Логи после импорта
console.log('authenticate (character.routes):', typeof authenticate);
console.log('authorizeRole (character.routes):', typeof authorizeRole);

// Создать персонажа
console.log('Route POST / using authenticate:', typeof authenticate);
router.post('/', authenticate, characterController.createCharacter);

// Удаление персонажа
console.log('Route DELETE /:id using authenticate:', typeof authenticate);
router.delete('/:id', authenticate, characterController.deleteCharacter);

// Редактирование персонажа
console.log('Route PUT /:id using authenticate:', typeof authenticate);
router.put('/:id', authenticate, characterController.updateCharacter);

// Увеличить уровень персонажа
console.log('Route PUT /level-up/:id using authenticate:', typeof authenticate);
router.put('/level-up/:id', authenticate, characterController.levelUpCharacter);

// Добавить опыт персонажу
console.log(
  'Route PUT /add-experience/:id using authenticate:',
  typeof authenticate,
);
router.put(
  '/add-experience/:id',
  authenticate,
  characterController.addExperience,
);

// Завершение задания персонажем
console.log(
  'Route PUT /complete-quest/:questId using authenticate:',
  typeof authenticate,
);
router.put(
  '/complete-quest/:questId',
  authenticate,
  characterController.completeQuest,
);

// Получить список персонажей
console.log(
  'Route GET / using characterController.getCharacters:',
  typeof characterController.getCharacters,
);
router.get('/', characterController.getCharacters);

// Получить рейтинг персонажей
console.log(
  'Route GET /leaderboard using characterController.getLeaderboard:',
  typeof characterController.getLeaderboard,
);
router.get('/leaderboard', characterController.getLeaderboard);

// Рендер страницы персонажей
console.log(
  'Route GET /view using characterController.renderCharacters:',
  typeof characterController.renderCharacters,
);
router.get('/view', characterController.renderCharacters);
// Рендер рейтинга персонажей
router.get('/leaderboard/view', characterController.renderLeaderboard);

// API для рейтинга
router.get('/leaderboard', characterController.getLeaderboard);

module.exports = router;
