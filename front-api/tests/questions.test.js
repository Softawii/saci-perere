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

describe('Questions endpoints', () => {
  const prefix = '/question';
  it('Should find all questions by category id', async () => {
    const category = await prisma.category.findFirst();
    const { statusCode, body } = await request(app).get(`${prefix}/?category=${category.id}`).send();
    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBeGreaterThanOrEqual(1);
  });
  it('Should find question by id', async () => {
    const question = await prisma.question.findFirst();
    const { statusCode, body } = await request(app).get(`${prefix}/${question.id}`).send();
    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.id).toBeDefined();
    expect(body.category_id).toBeDefined();
    expect(body.answer_id).toBeDefined();
    expect(body.value).toBeDefined();
  });
  it('Should authenticate and create question', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const category = await prisma.category.findFirst();
    const newQuestionBody = {
      question: 'aaaa',
      answer: 'null',
    };
    const { statusCode, body } = await request(app)
      .post(`${prefix}/?category=${category.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(newQuestionBody);

    expect(statusCode).toEqual(200);
    expect(body.value).toEqual(newQuestionBody.question);
    expect(body.answer.value).toEqual(newQuestionBody.answer);
  });
  it('Should authenticate and delete question', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const question = await prisma.question.findFirst();
    const { statusCode, body } = await request(app)
      .delete(`${prefix}/${question.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();

    expect(statusCode).toEqual(200);
  });
  it('Should authenticate and edit question', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const question = await prisma.question.findFirst();
    const newQuestionBody = {
      question: 'another one',
      answer: 'yes',
    };
    const { statusCode, body } = await request(app)
      .patch(`${prefix}/${question.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(newQuestionBody);

    expect(statusCode).toEqual(200);
    expect(body.value).toEqual(newQuestionBody.question);
    expect(body.answer.value).toEqual(newQuestionBody.answer);
  });
  // list and delete unknown questions
});
