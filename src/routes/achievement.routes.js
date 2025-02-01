const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

// Создать достижение
router.post(
  '/',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      await achievementController.createAchievement(req, res, next);
    } catch (err) {
      next(err); // Передаём ошибку в middleware
    }
  },
);

// Получить список достижений
router.get('/', async (req, res, next) => {
  try {
    await achievementController.getAllAchievements(req, res, next);
  } catch (err) {
    next(err); // Передаём ошибку в middleware
  }
});

// Присвоить достижение персонажу
router.put('/assign/:achievementId', authenticate, async (req, res, next) => {
  try {
    await achievementController.assignAchievement(req, res, next);
  } catch (err) {
    next(err); // Передаём ошибку в middleware
  }
});

// Рендер страницы достижений
router.get('/view', async (req, res, next) => {
  try {
    await achievementController.renderAchievements(req, res, next);
  } catch (err) {
    next(err); // Передаём ошибку в middleware
  }
});

module.exports = router;
