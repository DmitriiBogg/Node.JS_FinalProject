const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

//  Регистрация пользователя
router.post('/register', userController.registerUser);

//  Вход в систему
router.post('/login', userController.loginUser);

//  Выход из системы
router.get('/logout', (req, res) => {
  res.clearCookie('token'); //  Очистка JWT токена
  res.redirect('/login/view'); //  Перенаправление на страницу входа
});

//  Отображение страниц
router.get('/register/view', userController.renderRegister);
router.get('/login/view', userController.renderLogin);

module.exports = router;
