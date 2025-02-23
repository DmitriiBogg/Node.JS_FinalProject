const express = require('express');
const router = express.Router();
const questController = require('../controllers/quest.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');
const characterController = require('../controllers/character.controller');

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
// удаление задания
router.delete(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  questController.deleteQuest,
);

// Добавление отзыва к заданию
router.post('/:questId/review', authenticate, questController.addReview);

// Отображение страницы со списком заданий
router.get('/view', questController.renderQuests);
// юзер берет задание (фронт)
router.post('/take/:id', authenticate, questController.takeQuest);

module.exports = router;
