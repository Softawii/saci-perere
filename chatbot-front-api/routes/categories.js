const express = require('express');
const auth = require('./auth');
const { prisma } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  prisma.category.findMany()
    .then(result => {
      res.json(result || []);
    }).catch(reason => {
      console.error(reason);
      res.status(500).json({
        message: 'failed to fetch categories',
      });
    });
});

router.post('/', auth.checkAccessToken, checkContainsName, (req, res) => {
  prisma.category.create({
    data: {
      name: req.body.name,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    console.error(reason);
    if (reason?.code === 'P2002') {
      res.status(400).json({
        message: `category '${req.body.name}' already exists`,
      });
    } else {
      res.status(500).json({
        message: 'failed to create category',
      });
    }
  });
});

router.post('/rename', auth.checkAccessToken, checkContainsName, (req, res) => {
  prisma.category.update({
    where: {
      id: req.body.id,
    },
    data: {
      name: req.body.name,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    console.error(reason);
    if (reason?.code === 'P2025') {
      res.status(400).json({
        message: 'category does not exist',
      });
    } else {
      res.status(500).json({
        message: 'failed to rename question',
      });
    }
  });
});

router.post('/delete', auth.checkAccessToken, checkContainsId, (req, res) => {
  prisma.category.delete({
    where: {
      id: req.body.id,
    },
  }).then(result => {
    res.sendStatus(200);
  }).catch(reason => {
    console.error(reason);
    if (reason?.code === 'P2025') {
      res.status(400).json({
        message: 'category does not exist',
      });
    } else {
      res.status(500).json({
        message: 'failed to delete question',
      });
    }
  });
});

function checkContainsId(req, res, next) {
  if (!req.body.id) {
    return res.status(400).send({
      error: 'missing id',
    });
  }
  const id = req.body.id;
  if (Number.isNaN(parseInt(id))) {
    return res.status(400).send({
      error: 'id is not a number',
    });
  }
  return next();
}

function checkContainsName(req, res, next) {
  if (!req.body.name) {
    return res.status(400).send({
      error: 'missing name',
    });
  }
  return next();
}

module.exports = {
  router,
};
