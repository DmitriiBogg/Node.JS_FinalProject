const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const indexRoutes = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const characterRoutes = require('./routes/character.routes');
const adminRoutes = require('./routes/admin.routes');
const questRoutes = require('./routes/quest.routes');
const achievementRoutes = require('./routes/achievement.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

//  Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  Middleware для сессий и flash-сообщений
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(flash());
app.use(cookieParser()); // для работы с token (что бы не забывался пользователь если он добавлен... )

//  Middleware
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Подключение маршрутов
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/admin', adminRoutes);
app.use('/characters', characterRoutes);

//  Статические файлы (CSS)
app.use(express.static(path.join(__dirname, '../public')));

// Middleware для обработки 404 ошибок
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

//  Middleware для обработки ошибок (ДОЛЖНО БЫТЬ ПОСЛЕ МАРШРУТОВ!)
app.use(errorHandler);

//  Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

//  Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
