const express = require('express');
const auth = require('./auth');
const db = require('../db');

const router = express.Router();

router.get('/', auth.checkAccessToken, (req, res) => {
  db.query('SELECT * from chatbot.category')
    .then(result => {
      res.json({
        categories: result.rows,
      });
    });
});

module.exports = {
  router,
};
