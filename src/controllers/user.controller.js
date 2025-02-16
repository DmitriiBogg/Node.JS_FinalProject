const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Character = require('../models/character.model');

module.exports = {
  // Регистрация нового пользователя
  registerUser: async (req, res, next) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        req.flash('error', 'Email and password are required');
        return res.redirect('/auth/register');
      }

      // Проверяем, существует ли уже пользователь с таким email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash('error', 'Email already exists');
        return res.redirect('/auth/register');
      }

      const userRole = role || 'member'; // предотвращение ошибок
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        role: userRole,
      });

      // Автоматический вход после регистрации
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      res.cookie('token', token, { httpOnly: true });

      if (userRole === 'admin') {
        return res.redirect('/admin/view');
      } else {
        return res.redirect('/characters/view');
      }
    } catch (err) {
      next(err);
    }
  },

  // Аутентификация пользователя (вход)
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash('error', 'Email and password are required');
        return res.redirect('/');
      }
      console.log(' const first is working');
      const user = await User.findOne({ email });
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/');
      }

      console.log(' const token is working');
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      res.cookie('token', token, { httpOnly: true });

      console.log(`Успешный вход: ${email}, роль: ${user.role}`); // проверяем, дошло ли до адреса

      // редирект после логина
      if (user.role === 'admin') {
        return res.redirect('/admin/view');
      } else {
        return res.redirect('/characters/view');
      }
    } catch (err) {
      next(err);
    }
  },

  // Получение рейтинга пользователей
  getUserLeaderboard: async (req, res, next) => {
    try {
      const users = await User.find();
      const leaderboard = await Promise.all(
        users.map(async (user) => {
          const characters = await Character.find({
            userId: user._id,
          }).populate('achievements');

          const totalLevel =
            characters.length > 0
              ? characters.reduce((sum, char) => sum + char.level, 0)
              : 0;
          const totalQuests =
            characters.length > 0
              ? characters.reduce(
                  (sum, char) => sum + (char.completedQuests || 0),
                  0,
                )
              : 0;
          const totalAchievements =
            characters.length > 0
              ? characters.reduce(
                  (sum, char) =>
                    sum + (char.achievements ? char.achievements.length : 0),
                  0,
                )
              : 0;

          const rating =
            totalLevel * 10 + totalQuests * 5 + totalAchievements * 3;
          return {
            userId: user._id,
            email: user.email,
            rating,
            totalLevel,
            totalQuests,
            totalAchievements,
          };
        }),
      );
      leaderboard.sort((a, b) => b.rating - a.rating);
      res.status(200).json({ leaderboard });
    } catch (err) {
      next(err);
    }
  },

  // Отображение страницы с рейтингом пользователей
  renderUserLeaderboard: async (req, res, next) => {
    try {
      const users = await User.find();
      const leaderboard = await Promise.all(
        users.map(async (user) => {
          const characters = await Character.find({
            userId: user._id,
          }).populate('achievements');

          const totalLevel =
            characters.length > 0
              ? characters.reduce((sum, char) => sum + char.level, 0)
              : 0;
          const totalQuests =
            characters.length > 0
              ? characters.reduce(
                  (sum, char) => sum + (char.completedQuests || 0),
                  0,
                )
              : 0;
          const totalAchievements =
            characters.length > 0
              ? characters.reduce(
                  (sum, char) =>
                    sum + (char.achievements ? char.achievements.length : 0),
                  0,
                )
              : 0;

          const rating =
            totalLevel * 10 + totalQuests * 5 + totalAchievements * 3;
          return {
            userId: user._id,
            email: user.email,
            rating,
            totalLevel,
            totalQuests,
            totalAchievements,
          };
        }),
      );
      leaderboard.sort((a, b) => b.rating - a.rating);
      res.render('user_leaderboard', { leaderboard });
    } catch (err) {
      next(err);
    }
  },

  // Отображение страницы регистрации
  renderRegister: (req, res) => {
    res.render('register', { error: req.flash('error') });
  },

  // Отображение страницы входа
  renderLogin: (req, res) => {
    res.render('login', { error: req.flash('error') });
  },
};
