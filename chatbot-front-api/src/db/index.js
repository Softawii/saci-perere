const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const handleError = (error, entity = 'entity') => {
  const code = error?.code;
  if (code === 'P2002') {
    const targets = error.meta.target.join(', ');
    return `'${targets}' already in use`;
  }
  if (code === 'P2025') {
    return `${entity} does not exists`;
  }
  if (code === 'P2000') {
    return 'column must not exceed the maximum length';
  }
  if (code === 'P2016') {
    return `${entity} does not exists`;
  }
  return undefined;
};

async function isUserAdmin(id) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user?.isadmin;
}

module.exports = {
  prisma,
  handleError,
  isUserAdmin,
};
