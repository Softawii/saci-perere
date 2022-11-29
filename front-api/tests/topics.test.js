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

describe('Topics endpoints', () => {
  const prefix = '/topic';
  it('Should find all topics', async () => {
    const { statusCode, body } = await request(app).get(`${prefix}/`).send();
    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toEqual(2);
  });
  it('Should find all topics and its categories', async () => {
    const { statusCode, body } = await request(app)
      .get(`${prefix}/?categories=true`)
      .send();
    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toEqual(2);
    for (let i = 0; i < 2; i++) {
      expect(body[i].categories).toBeDefined();
      expect(body[i].categories).toBeInstanceOf(Array);
    }
  });
  it('Should topic find by id', async () => {
    const topic = await prisma.topic.findFirst();
    const { statusCode, body } = await request(app).get(`${prefix}/${topic.id}`).send();
    expect(statusCode).toEqual(200);
    const foundCategory = body;
    for (const key of Object.keys(foundCategory)) {
      expect(topic[key]).toEqual(foundCategory[key]);
    }
  });
  it('Should topic find by id and its categories', async () => {
    const topic = await prisma.topic.findFirst({
      include: {
        categories: true,
      },
    });
    const { statusCode, body } = await request(app)
      .get(`${prefix}/${topic.id}?categories=true`)
      .send();
    expect(statusCode).toEqual(200);
    const foundCategory = body;
    for (const key of Object.keys(foundCategory)) {
      expect(topic[key]).toEqual(foundCategory[key]);
    }
    expect(body.categories).toBeDefined();
    expect(body.categories).toBeInstanceOf(Array);
  });
  it('Should authenticate and edit topic', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const topic = await prisma.topic.findFirst();
    const newTopicBody = {
      name: 'Outro nome',
      description: 'Descrição muito braba',
    };
    const { statusCode, body } = await request(app)
      .patch(`${prefix}/${topic.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(newTopicBody);
    expect(statusCode).toEqual(200);
    for (const key of Object.keys(newTopicBody)) {
      expect(body[key]).toEqual(newTopicBody[key]);
    }
  });
  it('Should authenticate and delete topic', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const topic = await prisma.topic.findFirst();
    const newTopicBody = {
      name: 'Outro nome',
      description: 'Descrição muito braba',
    };
    const { statusCode, body } = await request(app)
      .delete(`${prefix}/${topic.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(newTopicBody);
    expect(statusCode).toEqual(204);
  });
});
