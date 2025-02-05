const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создание нового достижения (доступно только администратору)
router.post(
  '/',
  authenticate,
  authorizeRole('admin'),
  achievementController.createAchievement,
);

// Получение списка всех достижений
router.get('/', achievementController.getAllAchievements);

// Присвоение достижения персонажу
router.put(
  '/assign/:achievementId',
  authenticate,
  achievementController.assignAchievement,
);

// Отображение страницы с достижениями
router.get('/view', achievementController.renderAchievements);

module.exports = router;
