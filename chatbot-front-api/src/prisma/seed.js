const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function init() {
  await prisma.topic.create({
    data: {
      name: 'CC',
      categories: {
        create: categories,
      },
    },
  });
  await prisma.topic.create({
    data: {
      name: 'Letras',
    },
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
  await prisma.user.create({
    data: {
      name: 'fulana',
      username: 'fulaninha',
      email: 'fulana@mail.com',
      password: '$2b$10$YNGKtTOqftxiWRBbo.JIx.O4GvhSeSbKIhn7Oz2nUm.zeCJryYI9a',
      isadmin: false,
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

  // await prisma.unknown_question.create({
  //   data: {
  //     predicted_score: 0.87,
  //     user_question: 'O que é IM?',
  //     predicted_question: {
  //       create: {
  //         value: 'O que é IM?',
  //         answer: {
  //           create: {
  //             value: 'Instituto Multidisciplinar',
  //           },
  //         },
  //         category: {
  //           create: {
  //             name: 'aaa',
  //             description: 'bbbb',
  //             topic: {
  //               connect: {
  //                 name: 'CC',
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
}

async function clear() {
  await prisma.topic.deleteMany();
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
    questions: {
      create: [
        {
          value: 'O que é DTL?',
          answer: {
            create: {
              value: 'Departamento de Tecnologias e Linguagens',
            },
          },
        },
      ],
    },
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
