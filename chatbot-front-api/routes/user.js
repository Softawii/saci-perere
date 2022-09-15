const express = require('express');
const status = require('http-status');
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
        message: 'failed to fetch user',
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

router.patch('/profile', auth.checkAccessToken, (req, res) => {
  const data = {};
  for (const value of ['name', 'username', 'email']) {
    if (req.body[value]) {
      data[value] = req.body[value];
    }
  }
  if (Object.keys(data) === 0) return res.status(400).json({ message: 'Nenhum campo foi preenchdo' });
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

module.exports = {
  router,
};
