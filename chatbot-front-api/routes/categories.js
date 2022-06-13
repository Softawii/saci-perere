const express = require('express');
const auth = require('./auth');
const db = require('../db');

const router = express.Router();

router.get('/', auth.checkAccessToken, (req, res) => {
  db.query('SELECT * FROM chatbot.category ORDER BY name')
    .then(result => {
      res.json({
        categories: result.rows,
      });
    });
});

router.post('/', auth.checkAccessToken, checkContainsName, (req, res) => {
  const params = [req.body.name];
  db.query('SELECT count(*) FROM chatbot.category WHERE category.name = $1', params)
    .then(selectQuery => {
      if (selectQuery.rows[0].count === '1') {
        res.sendStatus(400);
      } else {
        db.query('INSERT INTO chatbot.category (name) VALUES ($1)', params)
          .then(result => {
            res.sendStatus(200);
          })
          .catch(err => {
            console.error(err);
            res.sendStatus(500);
          });
      }
    });
});

router.post('/rename', auth.checkAccessToken, checkContainsName, (req, res) => {
  const params = [req.body.name, req.body.id];
  db.query('SELECT count(*) FROM chatbot.category WHERE category.name = $1', [params[0]])
    .then(selectQuery => {
      if (selectQuery.rows[0].count === '1') {
        res.sendStatus(400);
      } else {
        db.query('UPDATE chatbot.category SET name = $1 WHERE id = $2', params)
          .then(result => {
            res.sendStatus(200);
          })
          .catch(err => {
            console.error(err);
            res.sendStatus(500);
          });
      }
    });
});

router.post('/delete', auth.checkAccessToken, checkContainsName, checkContainsId, (req, res) => {
  const params = [req.body.id];
  db.query('SELECT count(*) FROM chatbot.category WHERE category.id = $1', params)
    .then(selectQuery => {
      if (selectQuery.rows[0].count === '1') {
        db.query('DELETE FROM chatbot.category category WHERE category.id = $1', params)
          .then(result => {
            res.sendStatus(200);
          })
          .catch(err => {
            console.error(err);
            res.sendStatus(500);
          });
      } else {
        res.status(400)
          .json({
            error: 'category not found',
          });
      }
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

function checkContainsName(req, res, next) {
  if (!req.body.name) {
    return res.status(400).send({
      error: 'missing name',
    });
  }
  return next();
}

module.exports = {
  router,
};
