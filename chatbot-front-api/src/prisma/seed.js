const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function init() {
  await prisma.category.create({
    data: categories[0],
  });
  await prisma.category.create({
    data: categories[1],
  });

  await prisma.user.create({
    data: {
      ...user.database,
      favorites: {
        create: [
          {
            category: {
              connect: {
                name: 'DCC',
              },
            },
          },
        ],
      },
    },
  });
}

async function clear() {
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user_favorite.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.unknown_question.deleteMany();
}

const categories = [
  {
    name: 'DCC',
    description: 'Departamento de Ciência da Computação',
    questions: {
      create: [
        {
          value: 'O que é DCC?',
          answer: {
            create: {
              value: 'Departamento de Ciência da Computação',
            },
          },
        },
        {
          value: 'O que é PE?',
          answer: {
            create: {
              value: 'Programação Estruturada',
            },
          },
        },
      ],
    },
  },
  {
    name: 'DTL',
    description: 'Departamento de Tecnologias e Linguagens',
  },
];

const user = {
  database: {
    email: 'eduardo@mail.com',
    name: 'eduardo',
    username: 'eduardoferro',
    password: '$2b$10$YNGKtTOqftxiWRBbo.JIx.O4GvhSeSbKIhn7Oz2nUm.zeCJryYI9a',
    isadmin: true,
  },
  password: {
    raw: 'senha',
    hash: '$2b$10$YNGKtTOqftxiWRBbo.JIx.O4GvhSeSbKIhn7Oz2nUm.zeCJryYI9a',
  },
};

module.exports = {
  prisma,
  user,
  categories,
  initSeed: init,
  clearSeed: clear,
};
