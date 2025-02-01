const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Создать пользователя (регистрация)
router.post('/register', userController.registerUser);

// Логин пользователя
router.post('/login', userController.loginUser);

// Рендер страницы регистрации
router.get('/register/view', userController.renderRegister);

// Рендер страницы логина
router.get('/login/view', userController.renderLogin);

// API для рейтинга пользователей
router.get('/leaderboard', userController.getUserLeaderboard);

// Страница рейтинга пользователей
router.get('/leaderboard/view', userController.renderUserLeaderboard);

module.exports = router;
