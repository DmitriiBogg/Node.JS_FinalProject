const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

//  Регистрация пользователя (POST)
router.post('/register', userController.registerUser);

//  Вход в систему (POST)
router.post('/login', userController.loginUser);

//  Выход из системы (GET)
router.get('/logout', (req, res) => {
  if (!req.cookies?.token) {
    return res.status(400).json({ error: 'You are not logged in' });
  }
  res.clearCookie('token'); //  Очистка JWT токена
  res.redirect('/'); //   редирект на главную
});

// GET маршрут для страницы регистрации
router.get('/register', (req, res) => {
  res.render('register');
});

//  GET маршрут для страницы логина (если нужен)
router.get('/login', (req, res) => {
  res.render('index'); //
});

module.exports = router;
