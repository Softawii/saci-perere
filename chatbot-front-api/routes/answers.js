const express = require('express');
const status = require('http-status');
const auth = require('./auth');
const { prisma } = require('../db');

const router = express.Router();

router.get('/:id', checkContainsIdParam, (req, res) => {
  prisma.answer.findFirst({
    where: {
      id: req.params.id,
    },
    include: {
      questions: req.query?.questions === 'true',
    },
  }).then(result => {
    res.json(result);
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to fetch questions',
    });
  });
});

function checkContainsId(req, res, next) {
  if (!req.body.id) {
    return res.status(status.BAD_GATEWAY).send({
      error: 'missing id',
    });
  }
  const id = req.body.id;
  if (Number.isNaN(parseInt(id))) {
    return res.status(status.BAD_GATEWAY).send({
      error: 'id is not a number',
    });
  }
  return next();
}

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
