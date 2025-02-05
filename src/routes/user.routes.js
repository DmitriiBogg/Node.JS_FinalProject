const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Регистрация нового пользователя
router.post('/register', userController.registerUser);

// Вход в систему
router.post('/login', userController.loginUser);

// Отображение страницы регистрации
router.get('/register/view', userController.renderRegister);

// Отображение страницы входа
router.get('/login/view', userController.renderLogin);

// Получение рейтинга пользователей
router.get('/leaderboard', userController.getUserLeaderboard);

// Отображение страницы с рейтингом пользователей
router.get('/leaderboard/view', userController.renderUserLeaderboard);

module.exports = router;
