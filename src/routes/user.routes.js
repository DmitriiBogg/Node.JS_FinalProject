const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const router = express.Router();

// Создать пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newUser = await User.create({ email, password, role });
    // Исключаем пароль из ответа
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Логин пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // поиск в базе данных по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    // генерируем JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    // возвращаем Token  и информацию о пользователе
    res
      .status(200)
      .json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
