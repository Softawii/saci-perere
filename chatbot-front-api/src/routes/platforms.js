const express = require('express');
const status = require('http-status');
const { prisma } = require('../db');
const { checkUserIsAdmin } = require('../util');

const router = express.Router();

router.get('/', checkUserIsAdmin, (req, res) => {
  prisma.platform.findMany()
    .then(result => {
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch platforms',
      });
    });
});

module.exports = {
  router,
};
