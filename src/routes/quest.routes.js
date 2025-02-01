const express = require('express');
const router = express.Router();
const questController = require('../controllers/quest.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создать задание
router.post(
  '/',
  authenticate,
  authorizeRole('admin'),
  questController.createQuest,
);

// Получить все задания
router.get('/', questController.getAllQuests);

// Получить задание по ID

router.get('/:id', questController.getQuestById);

// Обновить статус задания

router.put(
  '/:id/status',
  authenticate,
  authorizeRole('admin'),
  questController.updateQuestStatus,
);

// Назначить задание персонажу

router.put('/assign', authenticate, questController.assignQuestToCharacter);

// Добавить отзыв

router.post('/:questId/review', authenticate, questController.addReview);

// Рендер страницы заданий

router.get('/view', questController.renderQuests);

module.exports = router;
