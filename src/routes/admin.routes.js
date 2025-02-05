const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');

//  Получение списка всех пользователей (доступно только администратору)
router.get(
  '/users',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },
);

//  Удаление пользователя (доступно только администратору)
router.delete(
  '/users/:id',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
);
//  Изменение роли пользователя (доступно только администратору)
router.put(
  '/users/:id/role',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!['admin', 'member'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true },
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (err) {
      next(err);
    }
  },
);
module.exports = router;
