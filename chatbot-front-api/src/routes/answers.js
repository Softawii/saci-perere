const express = require('express');
const status = require('http-status');
const { param, query } = require('express-validator');
const { prisma } = require('../db');

const router = express.Router();

router.get('/:id', param('id').isInt().toInt(10), query('questions').isBoolean().toBoolean(), (req, res) => {
  prisma.answer.findFirst({
    where: {
      id: req.params.id,
    },
    include: {
      // eslint-disable-next-line eqeqeq
      questions: req.query?.questions == true,
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

module.exports = {
  router,
};
