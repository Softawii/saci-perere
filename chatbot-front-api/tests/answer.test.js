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

describe('Answer endpoints', () => {
  const prefix = '/answer';
  it('Should find answer by id', async () => {
    const answer = await prisma.answer.findFirst();
    const { statusCode, body } = await request(app)
      .get(`${prefix}/${answer.id}`)
      .send();

    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Object);
    for (const key of Object.keys(body)) {
      expect(answer[key]).toEqual(body[key]);
    }
  });
  it('Should find answer by id and related question', async () => {
    const answer = await prisma.answer.findFirst({
      include: {
        questions: true,
      },
    });
    const { statusCode, body } = await request(app)
      .get(`${prefix}/${answer.id}?questions=true`)
      .send();

    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Object);
    for (const key of Object.keys(body)) {
      expect(answer[key]).toEqual(body[key]);
    }
  });
});
