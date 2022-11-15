const express = require('express');
const status = require('http-status');
const { query } = require('express-validator');
const { prisma } = require('../db');
const { checkUserIsAdmin, cache, objectHash } = require('../util');

const router = express.Router();

router.get('/', query('platform').isInt().toInt(10).optional({ nullable: true }), query('status').isInt().toInt(10).optional({ nullable: true }), checkUserIsAdmin, (req, res) => {
  const { platform, status: statusType } = req.query;
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
        ...(statusType !== null && {
          status: {
            equals: statusType,
          },
        }),
      },
    }).then(result => {
      cache.set(cacheKey, result);
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch feedbacks by platform',
      });
    });
  } else {
    prisma.feedback.findMany({
      where: {
        ...(statusType !== null && {
          status: {
            equals: statusType,
          },
        }),
      },
    }).then(result => {
      cache.set(cacheKey, result);
      res.json(result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch feedbacks',
      });
    });
  }
});

router.get('/text', query('platform').isInt().toInt(10).optional({ nullable: true }), query('page').isInt().toInt(10).default(1), checkUserIsAdmin, async (req, res) => {
  const { platform, page } = req.query;
  const pageSize = 5;
  const cacheKey = objectHash({
    ...req.body,
    url: req.originalUrl,
  });
  const isCached = cache.has(cacheKey);
  if (isCached) {
    res.json(cache.get(cacheKey));
  } else if (platform != null) {
    const condition = {
      where: {
        history: {
          platform_id: {
            equals: platform,
          },
        },
        status: {
          equals: 0,
        },
      },
    };
    const count = await prisma.feedback.count(condition);
    prisma.feedback.findMany({
      ...condition,
      take: pageSize,
      skip: pageSize * (page - 1),
      include: {
        history: true,
      },
    }).then(result => {
      cache.set(cacheKey, {
        data: result,
        count,
        pageSize,
        pages: Math.ceil(count / pageSize),
      });
      res.json({
        data: result,
        count,
        pageSize,
        pages: Math.ceil(count / pageSize),
      });
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch text feedbacks by platform',
      });
    });
  } else {
    const condition = {
      where: {
        status: {
          equals: 0,
        },
      },
    };
    const count = await prisma.feedback.count(condition);
    prisma.feedback.findMany({
      ...condition,
      take: pageSize,
      skip: pageSize * (page - 1),
    }).then(result => {
      cache.set(cacheKey, {
        data: result,
        count,
        pageSize,
        pages: Math.ceil(count / pageSize),
      });
      res.json({
        data: result,
        count,
        pageSize,
        pages: Math.ceil(count / pageSize),
      });
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch text feedbacks',
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
      cache.set(cacheKey, result);
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
      cache.set(cacheKey, result);
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
