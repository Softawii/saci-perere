const express = require('express');
const status = require('http-status');
const { query } = require('express-validator');
const { prisma } = require('../db');
const { checkUserIsAdmin, cache, objectHash } = require('../util');

const router = express.Router();

router.get('/', query('platform').isInt().toInt(10).optional({ nullable: true }), checkUserIsAdmin, (req, res) => {
  const { platform } = req.query;
  const cacheKey = objectHash({
    ...req.body,
    url: req.originalUrl,
  });
  const isCached = cache.has(cacheKey);
  if (isCached) {
    res.json(cache.get(cacheKey));
  } else if (platform != null) {
    prisma.feedback.findMany({
      where: {
        history: {
          platform_id: {
            equals: platform,
          },
        },
      },
    }).then(result => {
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch feedbacks by platform',
      });
    });
  } else {
    prisma.feedback.findMany()
      .then(result => {
        res.json(result);
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'failed to fetch feedbacks',
        });
      });
  }
});

router.get('/count', query('platform').isInt().toInt(10).optional({ nullable: true }), checkUserIsAdmin, (req, res) => {
  const { platform } = req.query;
  const cacheKey = objectHash({
    ...req.body,
    url: req.originalUrl,
  });
  const isCached = cache.has(cacheKey);
  if (isCached) {
    res.json(cache.get(cacheKey));
  } else if (platform != null) {
    prisma.feedback.groupBy({
      where: {
        history: {
          platform_id: {
            equals: platform,
          },
        },
      },
      by: [
        'status',
      ],
      _count: {
        status: true,
      },
    }).then(result => {
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to count feedbacks by platform',
      });
    });
  } else {
    prisma.feedback.groupBy({
      by: [
        'status',
      ],
      _count: {
        status: true,
      },
    }).then(result => {
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to count feedbacks',
      });
    });
  }
});

module.exports = {
  router,
};
