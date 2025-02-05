// 📌 Основной файл приложения (app.js)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');

const viewRoutes = require('./routes/views.routes');
const userRoutes = require('./routes/user.routes');
const characterRoutes = require('./routes/character.routes');
const questRoutes = require('./routes/quest.routes');
const achievementRoutes = require('./routes/achievement.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

//  Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Подключение маршрутов
app.use('/', viewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/auth', authRoutes); //  Подключение маршрутов для аутентификации
app.use('/admin', adminRoutes); // Подключение маршрутов для администратора
//  Middleware для обработки ошибок
app.use(errorHandler);

//  Статические файлы (CSS)
app.use(express.static(path.join(__dirname, '../public')));

//  Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

//  Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
