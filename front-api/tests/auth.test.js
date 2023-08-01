const request = require('supertest');
const app = require('../src/index');
const {
  prisma, initSeed, clearSeed, user,
} = require('../src/prisma/seed');

beforeEach(async () => {
  await initSeed();
});

afterEach(async () => {
  await clearSeed();
});

describe('Authentication endpoints', () => {
  const prefix = '/auth';
  it('Should signin', async () => {
    const { statusCode, body } = await request(app)
      .post(`${prefix}/signin`)
      .send({
        username: user.database.username,
        password: user.password.raw,
      });

    expect(statusCode).toEqual(200);
    expect(body.name).toBeDefined();
    expect(body.email).toBeDefined();
    expect(body.username).toBeDefined();
    expect(body.isadmin).toBeDefined();
    expect(body.token).toBeDefined();
  });
  it('Should signup', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const { statusCode, body } = await request(app)
      .post(`${prefix}/signup`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send({
        name: 'romulo',
        username: 'romulo',
        email: 'romulo@mail.com',
      });

    expect(statusCode).toEqual(201);
    expect(body.name).toBeDefined();
    expect(body.email).toBeDefined();
    expect(body.username).toBeDefined();
    expect(body.password).toBeDefined();
  });
  it('Should signup accept only valid emails', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const { statusCode, body } = await request(app)
      .post(`${prefix}/signup`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send({
        name: 'romulo',
        username: 'romulo',
        email: 'not_email',
      });

    expect(statusCode).toEqual(400);
  });
});
