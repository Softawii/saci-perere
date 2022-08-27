const express = require('express');
const { Prisma } = require('@prisma/client');
const status = require('http-status');
const auth = require('./auth');
const { prisma } = require('../db');

const router = express.Router();

router.get('/full', auth.checkAccessToken, (req, res) => sendReport(req, res, 'full_report'));

// router.get('/questions', auth.checkAccessToken, (req, res) => sendReport(req, res, 'questions_report'));

function sendReport(req, res, report) {
  const download = req.query.download === 'true';
  prisma.$queryRawUnsafe(Prisma.sql`SELECT * FROM full_report() AS result`)
    .then(result => {
      if (download) {
        res.setHeader('Content-disposition', `attachment; filename="${report}.json"`);
      } else {
        res.setHeader('Content-Type', 'application/json');
      }
      res.send(result[0].result);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch the report',
      });
    });
}

module.exports = {
  router,
};
