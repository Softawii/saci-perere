const express = require('express');
const auth = require('./auth');
const { prisma } = require('../db');

const router = express.Router();

router.post('/', checkContainsId, (req, res) => {
  prisma.question.findMany({
    where: {
      category_id: req.body.id,
    },
  }).then(result => {
    res.json({
      questions: result || [],
    });
  }).catch(reason => {
    console.error(reason);
    res.status(500).json({
      message: 'failed to fetch questions',
    });
  });
});

router.post('/create', auth.checkAccessToken, checkContainsId, (req, res) => {
  prisma.question.create({
    data: {
      value: req.body.question,
      category: {
        connect: {
          id: req.body.id,
        },
      },
      answer: {
        create: {
          value: req.body.answer,
        },
      },
    },
    include: {
      answer: false,
      category: false,
    },
  }).then(result => {
    res.json({
      questionId: result.id || null,
    });
  }).catch(reason => {
    console.error(reason);
    res.status(500).json({
      message: 'failed to create question',
    });
  });
});

router.post('/delete', auth.checkAccessToken, checkContainsId, (req, res) => {
  prisma.question.delete({
    where: {
      id: req.body.id,
    },
  }).then(result => {
    res.sendStatus(200);
  }).catch(reason => {
    console.error(reason);
    if (reason?.code === 'P2025') {
      res.status(400).json({
        message: 'question does not exist',
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

module.exports = {
  router,
};
