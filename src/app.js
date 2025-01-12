const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const characterRoutes = require('./routes/character.routes');
const questRoutes = require('./routes/quest.routes');

dotenv.config(); // Подключение переменных из .env

const app = express();

// Use штучки

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/quests', questRoutes);
// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Пример маршрута
app.get('/', (req, res) => {
  res.send('Guild Adventurers API is running!');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
