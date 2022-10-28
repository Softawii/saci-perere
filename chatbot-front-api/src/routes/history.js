const express = require('express');
const status = require('http-status');
const { query } = require('express-validator');
const { prisma } = require('../db');
const { checkUserIsAdmin } = require('../util');

const router = express.Router();

// TODO: cache
router.get('/', query('platform').isInt().toInt(10).optional({ nullable: true }), checkUserIsAdmin, (req, res) => {
  const { platform } = req.query;
  if (platform != null) {
    prisma.history.findMany({
      where: {
        platform_id: {
          equals: platform,
        },
      },
    }).then(result => {
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch history by platform',
      });
    });
  } else {
    prisma.history.findMany()
      .then(result => {
        res.json(result);
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'failed to fetch history',
        });
      });
  }
});

// TODO: cache
router.get('/count', query('platform').isInt().toInt(10).optional({ nullable: true }), checkUserIsAdmin, (req, res) => {
  const { platform } = req.query;
  if (platform != null) {
    prisma.history.count({
      where: {
        platform_id: {
          equals: platform,
        },
      },
    }).then(result => {
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch history by platform',
      });
    });
  } else {
    prisma.history.count()
      .then(result => {
        res.json(result);
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'failed to fetch history',
        });
      });
  }
});

module.exports = {
  router,
};
