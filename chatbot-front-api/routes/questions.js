const express = require('express');
const auth = require('./auth');
const db = require('../db');

const router = express.Router();

router.post('/', checkContainsId, (req, res) => {
  const params = [req.body.id];
  db.query('SELECT id, question FROM chatbot.category_question WHERE category_id = $1', params)
    .then(result => {
      res.json({
        questions: result.rows,
      });
    });
});

router.post('/create', checkContainsId, checkContainsQuestionAnswer, (req, res) => {
  db.query('INSERT INTO chatbot.category_question (category_id, question) VALUES($1, $2) RETURNING id', [req.body.id, req.body.question])
    .then(result => {
      const questionId = result.rows[0].id;
      db.query('INSERT INTO chatbot.question_answer (question_id, answer) VALUES($1, $2)', [questionId, req.body.answer])
        .then(result => {
          res.json({
            questionId,
          });
        });
    });
});

router.post('/delete', checkContainsId, (req, res) => {
  db.query('DELETE FROM chatbot.category_question WHERE id = $1', [req.body.id])
    .then(result => {
      res.json({
      });
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

function checkContainsQuestionAnswer(req, res, next) {
  const requiredParams = ['question', 'answer'];
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return res.status(400).send({
        error: `missing ${param} parameter`,
      });
    }
  }
  return next();
}

module.exports = {
  router,
};
