const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

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

module.exports = router;
