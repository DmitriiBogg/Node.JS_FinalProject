const express = require('express');
const router = express.Router();
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');
const characterController = require('../controllers/character.controller');
const User = require('../models/user.model');
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
// Переход на страницу с персонажами
router.get('/view', authenticate, characterController.renderCharacters);

// Переход на страницу администратора
router.get(
  '/admin/view',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const users = await User.find(); // Загружаем пользователей
      res.render('admin', { users }); // Рендерим admin.ejs
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
