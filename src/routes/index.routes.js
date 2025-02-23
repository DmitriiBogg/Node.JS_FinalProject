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

module.exports = router;
