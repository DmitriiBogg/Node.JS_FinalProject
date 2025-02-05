const express = require('express');
const router = express.Router();
const questController = require('../controllers/quest.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создание нового задания (доступно только администратору)
router.post(
  '/',
  authenticate,
  authorizeRole('admin'),
  questController.createQuest,
);

// Получение списка всех заданий
router.get('/', questController.getAllQuests);

// Получение задания по ID
router.get('/:id', questController.getQuestById);

// Обновление статуса задания (доступно только администратору)
router.put(
  '/:id/status',
  authenticate,
  authorizeRole('admin'),
  questController.updateQuestStatus,
);

// Назначение задания персонажу
router.put('/assign', authenticate, questController.assignQuestToCharacter);

// Добавление отзыва к заданию
router.post('/:questId/review', authenticate, questController.addReview);

// Отображение страницы со списком заданий
router.get('/view', questController.renderQuests);

module.exports = router;
