const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Quest = require('../models/quest.model');
const Achievement = require('../models/achievement.model');
const {
  authenticate,
  authorizeRole,
} = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

// Рендеринг страницы админа с пользователями, квестами и ачивками
router.get(
  '/view',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const users = await User.find();
      const quests = await Quest.find();
      const achievements = await Achievement.find();

      res.render('admin', {
        users,
        quests,
        achievements,
        success: req.flash('success') || [],
        error: req.flash('error') || [],
      });
    } catch (err) {
      next(err);
    }
  },
);

// Получение списка пользователей
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

// Удаление пользователя
router.delete(
  '/users/:id',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/admin/view');
      }
      req.flash('success', 'User deleted successfully.');
      res.redirect('/admin/view');
    } catch (err) {
      req.flash('error', 'Error deleting user.');
      res.redirect('/admin/view');
    }
  },
);

// Изменение роли пользователя
router.put(
  '/users/:id/role',
  authenticate,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!['admin', 'member'].includes(role)) {
        req.flash('error', 'Invalid role.');
        return res.redirect('/admin/view');
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true },
      );
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/admin/view');
      }

      req.flash('success', 'User role updated successfully.');
      res.redirect('/admin/view');
    } catch (err) {
      req.flash('error', 'Error updating user role.');
      res.redirect('/admin/view');
    }
  },
);

// Создание нового задания
router.post(
  '/quests',
  authenticate,
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const { title, description, difficulty, reward } = req.body;

      if (!title || !description || !difficulty) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/admin/view');
      }

      if (title.length < 3 || description.length < 6) {
        req.flash(
          'error',
          'Title must be at least 3 characters and description at least 10.',
        );
        return res.redirect('/admin/view');
      }
      // Преобразуем строки в числа
      const formattedReward = {
        gold: Number(reward.gold) || 0,
        experience: Number(reward.experience) || 0,
      };
      await Quest.create({ title, description, difficulty, reward });

      req.flash('success', 'Quest created successfully!');
      res.redirect('/admin/view');
    } catch (err) {
      console.log(err);

      req.flash('error', 'Error creating quest.');
      res.redirect('/admin/view');
    }
  },
);

// Создание новой ачивки
router.post(
  '/achievements',
  authenticate,
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const { title, description, criteria, threshold, reward } = req.body;

      if (!title || !description || !criteria || !threshold) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/admin/view');
      }

      if (title.length < 3 || description.length < 5) {
        req.flash(
          'error',
          'Title must be at least 3 characters and description at least 5.',
        );
        return res.redirect('/admin/view');
      }

      await Achievement.create({
        title,
        description,
        criteria,
        threshold,
        reward,
      });

      req.flash('success', 'Achievement created successfully!');
      res.redirect('/admin/view');
    } catch (err) {
      req.flash('error', 'Error creating achievement.');
      res.redirect('/admin/view');
    }
  },
);
// Удаление пользователя администратором
router.delete(
  '/users/:id',
  authenticate,
  authorizeRole('admin'),
  (req, res, next) => {
    console.log('DELETE /admin/users/:id called with ID:', req.params.id);
    next();
  },
  userController.deleteUser,
);
module.exports = router;
