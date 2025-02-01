const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Character = require('../models/character.model');
module.exports = {
  registerUser: async (req, res, next) => {
    try {
      const { email, password, role } = req.body;

      // Проверяем, переданы ли все данные
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Проверяем, переданы ли данные
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );

      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },
  renderRegister: (req, res) => {
    res.render('register'); // EJS-шаблон register
  },
  renderLogin: (req, res) => {
    res.render('login'); // EJS-шаблон login
  },

  getUserLeaderboard: async (req, res, next) => {
    try {
      const users = await User.find(); // Загружаем всех пользователей

      // Считаем рейтинг для каждого пользователя
      const leaderboard = await Promise.all(
        users.map(async (user) => {
          const characters = await Character.find({
            userId: user._id,
          }).populate('achievements');

          const totalLevel = characters.reduce(
            (sum, char) => sum + char.level,
            0,
          );
          const totalQuests = characters.reduce(
            (sum, char) => sum + (char.completedQuests || 0),
            0,
          );
          const totalAchievements = characters.reduce(
            (sum, char) =>
              sum + (char.achievements ? char.achievements.length : 0),
            0,
          );

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

      // Сортируем по рейтингу
      leaderboard.sort((a, b) => b.rating - a.rating);

      res.status(200).json({ leaderboard });
    } catch (err) {
      next(err);
    }
  },

  renderUserLeaderboard: async (req, res, next) => {
    try {
      const users = await User.find();

      const leaderboard = await Promise.all(
        users.map(async (user) => {
          const characters = await Character.find({
            userId: user._id,
          }).populate('achievements');

          const totalLevel = characters.reduce(
            (sum, char) => sum + char.level,
            0,
          );
          const totalQuests = characters.reduce(
            (sum, char) => sum + (char.completedQuests || 0),
            0,
          );
          const totalAchievements = characters.reduce(
            (sum, char) =>
              sum + (char.achievements ? char.achievements.length : 0),
            0,
          );

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
};
