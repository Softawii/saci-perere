const express = require('express');
const status = require('http-status');
const { query } = require('express-validator');
const { prisma } = require('../db');
const { checkUserIsAdmin, cache, objectHash } = require('../util');

const router = express.Router();

router.get(
  '/',
  query('platform').isInt().toInt(10).optional({ nullable: true }),
  query('detail').isBoolean().toBoolean(10).optional({ nullable: true }),
  query('page').isInt().toInt(10).default(1),
  checkUserIsAdmin,
  async (req, res) => {
    const { platform, detail, page } = req.query;
    const pageSize = 50;
    const cacheKey = objectHash({
      ...req.body,
      url: req.originalUrl,
    });
    const isCached = cache.has(cacheKey);
    if (isCached) {
      res.json(cache.get(cacheKey));
    } else if (platform != null) {
      const count = await prisma.history.count({
        where: {
          platform_id: {
            equals: platform,
          },
        },
      });
      prisma.history.findMany({
        take: pageSize,
        skip: pageSize * (page - 1),
        where: {
          platform_id: {
            equals: platform,
          },
        },
        include: {
          ...(detail && {
            question: {
              select: {
                value: true,
                category: {
                  select: {
                    name: true,
                    topic: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          }),
        },
      }).then(result => {
        res.json({
          data: result,
          count,
          pageSize,
          pages: Math.ceil(count / pageSize),
        });
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'failed to fetch history by platform',
        });
      });
    } else {
      const count = await prisma.history.count({
        where: {
          platform_id: {
            equals: platform,
          },
        },
      });
      prisma.history.findMany({
        take: pageSize,
        skip: pageSize * page,
        include: {
          ...(detail && {
            question: {
              select: {
                value: true,
                category: {
                  select: {
                    name: true,
                    topic: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          }),
        },
      }).then(result => {
        res.json({
          data: result,
          count,
          pageSize,
          pages: Math.ceil(count / pageSize),
        });
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'failed to fetch history',
        });
      });
    }
  },
);

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
