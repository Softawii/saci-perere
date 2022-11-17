const express = require('express');
const { Prisma } = require('@prisma/client');
const status = require('http-status');
const { prisma } = require('../db');
const { objectHash, cache } = require('../util');

const router = express.Router();

router.get('/full', (req, res) => sendReport(req, res));

function sendReport(req, res) {
  const download = req.query.download === 'true';
  if (download) {
    res.setHeader('Content-disposition', 'attachment; filename="full_report.json"');
  } else {
    res.setHeader('Content-Type', 'application/json');
  }
  const cacheKey = objectHash({
    url: '/report',
  });
  const isCached = cache.has(cacheKey);
  if (isCached) {
    res.send(cache.get(cacheKey));
    return;
  }
  prisma.$queryRawUnsafe(Prisma.sql`SELECT * FROM full_report() AS result`)
    .then(result => {
      cache.set(cacheKey, result[0].result, 3600);
      res.send(result[0].result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch the full report',
      });
    });
}

module.exports = {
  router,
};
