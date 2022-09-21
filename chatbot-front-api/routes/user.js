const express = require('express');
const status = require('http-status');
const bcrypt = require('bcrypt');
const auth = require('./auth');
const { prisma } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  prisma.user.findMany({
    select: {
      id: true,
      username: true,
      password: false,
      name: true,
      email: true,
      isadmin: true,
      favorites: false,
    },
  }).then(result => res.json(result))
    .catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch users',
      });
    });
});

router.get('/profile', auth.checkAccessToken, (req, res) => {
  prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  }).then(result => {
    const username = result.username;
    const name = result.name;
    const email = result.email;
    const isadmin = result.isadmin;

    return res.json({
      name,
      email,
      username,
      isadmin,
    });
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to fetch user',
    });
  });
});

router.patch('/profile', auth.checkAccessToken, async (req, res) => {
  const data = {};
  for (const value of ['name', 'username', 'email']) {
    if (req.body[value]) {
      data[value] = req.body[value];
    }
  }
  if (req.body.password) {
    const saltRounds = 10;
    data.password = bcrypt.hashSync(req.body.password, saltRounds);
  }
  if (Object.keys(data) === 0) return res.status(400).json({ message: 'Nenhum campo foi preenchido' });
  prisma.user.update({
    where: {
      id: req.userId,
    },
    data,
  }).then(result => {
    const username = result.username;
    const name = result.name;
    const email = result.email;
    const isadmin = result.isadmin;

    return res.json({
      name,
      email,
      username,
      isadmin,
    });
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to update user',
    });
  });
});

router.post('/give-admin/:id', auth.checkAccessToken, checkContainsIdParam, async (req, res) => {
  prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  }).then(result => {
    if (result.isadmin) {
      prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isadmin: true,
        },
      }).then(result => {
        res.sendStatus(status.NO_CONTENT);
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'user do not exists to grant admin permission',
        });
      });
    } else {
      res.status(status.FORBIDDEN).json({
        message: 'user is not admin to grant admin permission',
      });
    }
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'unexpected error',
    });
  });
});

function checkContainsIdParam(req, res, next) {
  const id = Number(req.params.id, 10);
  if (!id) {
    return res.status(status.BAD_REQUEST).send({
      error: 'invalid id param',
    });
  }
  if (Number.isNaN(id)) {
    return res.status(status.BAD_REQUEST).send({
      error: 'id is not a number',
    });
  }
  req.params.id = id;
  return next();
}

module.exports = {
  router,
};
