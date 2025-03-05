const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Character = require('../src/models/character.model');
const Quest = require('../src/models/quest.model');
const Achievement = require('../src/models/achievement.model');
const { faker } = require('@faker-js/faker');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('clear base...');
    await User.deleteMany({});
    await Character.deleteMany({});
    await Quest.deleteMany({});
    await Achievement.deleteMany({});

    console.log('make new user...');
    const testUser = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    await testUser.save();
    console.log(`user is made: ${testUser.email}`);

    return testUser;
  } catch (error) {
    console.error('error for testUser:', error);
    throw error;
  }
};

module.exports = { seedDatabase };
