const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Character = require('../models/character.model');

// Регистрация нового пользователя
const registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email and password are required');
      return res.redirect('/auth/register');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already exists');
      return res.redirect('/auth/register');
    }

    const userRole = role || 'member';
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    console.log(' Generated JWT token:', token);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 3600000, // 1 час
    });

    return res.redirect(
      userRole === 'admin' ? '/admin/view' : '/characters/view',
    );
  } catch (err) {
    next(err);
  }
};

// Вход в систему

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash('error', 'Email and password are required');
      return res.redirect('/');
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res.cookie('token', token, { httpOnly: true });

    // редирект после логина
    if (user.role === 'admin') {
      return res.redirect('/admin/view');
    } else {
      return res.redirect('/characters/view');
    }
  } catch (err) {
    next(err);
  }
};

// Получение рейтинга пользователей (пересчитывается динамически)

const getUserLeaderboard = async (req, res, next) => {
  try {
    const sort = req.query.sort || 'rating';
    const users = await User.find({ role: { $ne: 'admin' } });
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
          (sum, char) => sum + (char.achievements?.length || 0),
          0,
        );

        return {
          userId: user._id,
          email: user.email,
          rating: totalLevel * 10 + totalQuests * 5 + totalAchievements * 3,
          totalLevel,
          totalQuests,
          totalAchievements,
        };
      }),
    );

    // Сортировка данных по параметру запроса
    if (sort === 'rating') {
      leaderboard.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'level') {
      leaderboard.sort((a, b) => b.totalLevel - a.totalLevel);
    }
    // таблица с рейтингом персонажей
    const characterLeaderboard = await Character.find().sort({ level: -1 });

    res.render('leaderboard', {
      leaderboard,
      characterLeaderboard,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// Отображение страницы регистрации
const renderRegister = (req, res) => {
  res.render('register', { error: req.flash('error') });
};

// Отображение страницы входа
const renderLogin = (req, res) => {
  res.render('login', { error: req.flash('error') });
};

// Отображение страницы с рейтингом пользователей
const renderUserLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
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
          (sum, char) => sum + (char.achievements?.length || 0),
          0,
        );

        return {
          userId: user._id,
          email: user.email,
          rating: totalLevel * 10 + totalQuests * 5 + totalAchievements * 3,
          totalLevel,
          totalQuests,
          totalAchievements,
        };
      }),
    );
    // таблица с рейтингом персонажей
    const characterLeaderboard = await Character.find().sort({ level: -1 });
    leaderboard.sort((a, b) => b.rating - a.rating);
    res.render('leaderboard', {
      leaderboard,
      characterLeaderboard,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// Экспорт всех функций
module.exports = {
  registerUser,
  loginUser,
  getUserLeaderboard,
  renderRegister,
  renderLogin,
  renderUserLeaderboard,
};
