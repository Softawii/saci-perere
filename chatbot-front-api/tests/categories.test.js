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

describe('Categories endpoints', () => {
  const prefix = '/category';
  it('Should find all categories', async () => {
    const { statusCode, body } = await request(app).get(`${prefix}/`).send();
    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toEqual(2);
  });
  it('Should find all categories and return if any is favorite', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const { statusCode, body } = await request(app)
      .get(`${prefix}/`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();
    expect(statusCode).toEqual(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toEqual(2);
    expect(body[0].favorite).toEqual(true);
  });
  it('Should find by id', async () => {
    const category = await prisma.category.findFirst();
    const { statusCode, body } = await request(app).get(`${prefix}/${category.id}`).send();
    expect(statusCode).toEqual(200);
    const foundCategory = body;
    for (const key of Object.keys(foundCategory)) {
      expect(category[key]).toEqual(foundCategory[key]);
    }
  });
  it('Should authenticate, find by id and find if is favorite', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const category = await prisma.category.findFirst();
    const { statusCode, body } = await request(app)
      .get(`${prefix}/${category.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();

    expect(statusCode).toEqual(200);
    const foundCategory = body;
    expect(foundCategory.id).toEqual(category.id);
    expect(foundCategory.name).toEqual(category.name);
    expect(foundCategory.description).toEqual(category.description);
    expect(foundCategory.favorite).toEqual(true);
  });
  it('Should not find by id', async () => {
    const { statusCode, body } = await request(app).get(`${prefix}/-1`).send();
    expect(statusCode).toEqual(404);
  });
  it('Should authenticate and create category', async () => {
    const categoryBody = {
      name: 'Nome brabo',
      description: null,
    };
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const { statusCode, body } = await request(app)
      .post(`${prefix}/`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(categoryBody);
    expect(statusCode).toEqual(200);
    expect(body.name).toEqual(body.name);
    expect(body.description).toEqual(body.description);
  });
  it('Should not create category because is unauthenticated', async () => {
    const categoryBody = {
      name: 'Nome brabo',
      description: null,
    };
    const { statusCode, body } = await request(app)
      .post(`${prefix}/`)
      .send(categoryBody);
    expect(statusCode).toEqual(401);
  });
  it('Should authenticate and remove category from favorite', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const category = await prisma.user_favorite.findFirst({
      where: {
        user: {
          username: {
            equals: user.database.username,
          },
        },
      },
    });

    const { statusCode, body } = await request(app)
      .delete(`${prefix}/favorite/${category.category_id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();
    expect(statusCode).toEqual(204);
  });
  it('Should authenticate and set category as favorite', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const category = await prisma.category.findFirst({
      where: {
        favorites: {
          none: {
            user: {
              username: user.database.username,
            },
          },
        },
      },
    });

    const { statusCode, body } = await request(app)
      .post(`${prefix}/favorite/${category.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();
    expect(statusCode).toEqual(201);
  });
  it('Should authenticate and edit category', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const category = await prisma.category.findFirst();
    const newCategoryBody = {
      name: 'Outro nome',
      description: 'Descrição muito braba',
    };
    const { statusCode, body } = await request(app)
      .patch(`${prefix}/${category.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send(newCategoryBody);
    expect(statusCode).toEqual(200);
    for (const key of Object.keys(newCategoryBody)) {
      expect(body[key]).toEqual(newCategoryBody[key]);
    }
  });
  it('Should authenticate and delete category', async () => {
    const authRes = await request(app)
      .post('/auth/signin')
      .send({
        username: user.database.username,
        password: user.password.raw,
      });
    expect(authRes.statusCode).toEqual(200);

    const category = await prisma.category.findFirst();
    const { statusCode, body } = await request(app)
      .delete(`${prefix}/${category.id}`)
      .set('Authorization', `Bearer ${authRes.body.token}`)
      .send();
    expect(statusCode).toEqual(204);
  });
});
