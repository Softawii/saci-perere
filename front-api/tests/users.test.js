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

describe('Users endpoints', () => {
  const prefix = '/user';
  it('Should find all users', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const { statusCode, body } = await request(app)
      .get(`${prefix}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();

    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toEqual(2);
  });
  it('Should get user profile', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const { statusCode, body } = await request(app)
      .patch(`${prefix}/profile`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();

    expect(statusCode).toEqual(200);
    expect(body.name).toBeDefined();
    expect(body.email).toBeDefined();
    expect(body.username).toBeDefined();
    expect(body.isadmin).toBeDefined();
  });
  it('Should find all users', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const profileBody = {
      name: 'fulano',
      email: 'fulano@mail.com',
      username: 'fulaninho',
    };
    const { statusCode, body } = await request(app)
      .patch(`${prefix}/profile`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(profileBody);

    expect(statusCode).toEqual(200);
    expect(body.name).toBeDefined();
    expect(body.email).toBeDefined();
    expect(body.username).toBeDefined();
    expect(body.isadmin).toBeDefined();
  });
  it('Should give user admin', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const fulana = await prisma.user.findFirst({
      where: {
        username: {
          equals: 'fulaninha',
        },
      },
    });
    const { statusCode, body } = await request(app)
      .post(`${prefix}/give-admin/${fulana.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();

    expect(statusCode).toEqual(204);
  });
});
