const { expect } = require('chai');
const mongoose = require('mongoose');
const { seedDatabase } = require('../util/seed_db');
require('dotenv').config();

before(async function () {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      serverSelectionTimeoutMS: 5000,
    });
  }
});

// Mocha test
describe('first test Mocha', function () {
  it('Check, that 2+2 = 4', function () {
    expect(2 + 2).to.equal(4);
  });
});

// bd test
describe('database test', function () {
  beforeEach(async function () {
    this.testUser = await seedDatabase();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it('clean BD before tests', async function () {
    const users = await mongoose.model('User').find();
    expect(users.length).to.equal(1);
  });

  it('make new User', async function () {
    expect(this.testUser).to.have.property('email');
    expect(this.testUser.email).to.be.a('string');
  });
});
