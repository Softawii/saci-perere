const express = require('express');
const auth = require('./auth');
const db = require('../db');

const router = express.Router();

router.post('/', auth.checkAccessToken, checkContainsId, (req, res) => {
  const params = [req.body.id];
  db.query('SELECT question_id as questionId, answer FROM chatbot.question_answer WHERE question_id = $1', params)
    .then(result => {
      res.json([...result.rows]);
    });
});

function checkContainsId(req, res, next) {
  if (!req.body.id) {
    return res.status(400).send({
      error: 'missing id',
    });
  }
  const id = req.body.id;
  if (Number.isNaN(parseInt(id))) {
    return res.status(400).send({
      error: 'id is not a number',
    });
  }
  return next();
}

module.exports = {
  router,
};
