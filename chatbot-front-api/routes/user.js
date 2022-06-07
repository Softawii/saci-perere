const express = require('express');
const auth = require('./auth');
const db = require('../db');

const router = express.Router();

router.get('/details', auth.checkAccessToken, (req, res) => {
  db.query('SELECT * FROM chatbot.user WHERE id = $1 LIMIT 1', [req.userId])
    .then(result => {
      const row = result.rows[0];
      const username = row.username;
      const name = row.name;
      const email = row.email;

      return res.json({
        name,
        email,
        username,
      });
    });
});

module.exports = {
  router,
};
