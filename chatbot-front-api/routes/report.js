const express = require('express');
const auth = require('./auth');
const db = require('../db');

const router = express.Router();

router.get('/full', auth.checkAccessToken, (req, res) => sendReport(req, res, 'full_report'));

router.get('/questions', auth.checkAccessToken, (req, res) => sendReport(req, res, 'questions_report'));

function sendReport(req, res, report) {
  const download = req.query.download === 'true';
  db.query(`SELECT * FROM ${report}() AS result`)
    .then(result => {
      const jsonStr = result.rows[0].result;
      const json = JSON.parse(jsonStr);
      if (download) {
        res.setHeader('Content-disposition', `${report}.json`);
      }
      res.json(json);
    });
}

module.exports = {
  router,
};
