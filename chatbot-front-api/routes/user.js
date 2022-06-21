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

router.post('/set-profile', auth.checkAccessToken, (req, res) => {
  let i = 1;
  let query = '';
  const params = [];
  for (const value of ['name', 'username', 'email']) {
    if (req.body[value]) {
      query += `${value} = $${i++}, `;
      params.push(req.body[value]);
    }
  }
  if (query) query = query.slice(0, -1);
  if (!params.length) return res.status(400).json({ message: 'Nenhum campo foi preenchdo' });
  db.query(`UPDATE chatbot.user SET ${query.slice(0, -1)} WHERE id = $${i++}`, [...params, req.userId])
    .then(resultUpdate => {
      db.query('SELECT * FROM chatbot.user WHERE id = $1 LIMIT 1', [req.userId])
        .then(resultSelect => {
          const row = resultSelect.rows[0];
          const username = row.username;
          const name = row.name;
          const email = row.email;

          return res.json({
            name,
            email,
            username,
          });
        });
    })
    .catch(err => res.status(500).json(err));
});

module.exports = {
  router,
};
