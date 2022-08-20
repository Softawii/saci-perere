const express = require('express');
const auth = require('./auth');
const { prisma } = require('../db');

const router = express.Router();

router.post('/', checkContainsId, (req, res) => {
  prisma.question.findFirst({
    where: {
      id: req.body.id,
    },
    include: {
      answer: true,
    },
  }).then(result => {
    res.json({
      ...result.answer,
    });
  }).catch(reason => {
    console.error(reason);
    res.status(500).json({
      message: 'failed to fetch questions',
    });
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

module.exports = {
  router,
};
