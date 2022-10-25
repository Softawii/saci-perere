const express = require('express');
const { Prisma } = require('@prisma/client');
const status = require('http-status');
const { prisma } = require('../db');
const { checkAccessToken } = require('../util');

const router = express.Router();

router.get('/full', checkAccessToken, (req, res) => sendReport(req, res));

function sendReport(req, res) {
  const download = req.query.download === 'true';
  prisma.$queryRawUnsafe(Prisma.sql`SELECT * FROM full_report() AS result`)
    .then(result => {
      if (download) {
        res.setHeader('Content-disposition', 'attachment; filename="full_report.json"');
      } else {
        res.setHeader('Content-Type', 'application/json');
      }
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
