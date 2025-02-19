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
// выход из профиля и рендер на главную страницу
router.get('/logout', (req, res) => {
  if (!req.cookies?.token) {
    return res.status(400).json({ error: 'You are not logged in' });
  }
  res.clearCookie('token'); // Очистка JWT токена
  res.redirect('/'); //  редиректит на index.ejs
});
module.exports = router;
