const chai = require('chai');
const { app } = require('../src/app');

let chaiHttp;

before(async function () {
  chaiHttp = (await import('chai-http')).default; //  load like  ESM
  chai.use(chaiHttp);
});

const { expect } = chai;

console.log('Check: chai.request =', typeof chai.request);

describe('my register tests', function () {
  it('register page ', async function () {
    const res = await chai.request(app).get('/register');
    expect(res).to.have.status(200);
  });

  it('login page', async function () {
    const res = await chai.request(app).get('/');
    expect(res).to.have.status(200);
  });

  it('logout must give a error', async function () {
    const res = await chai.request(app).get('/logout');
    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.property('error')
      .that.includes('You are not logged in');
  });
});
