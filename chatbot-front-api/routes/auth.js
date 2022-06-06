/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const saltRounds = 10;

const router = express.Router();

router.post('/signin', checkAuthParams, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query('SELECT * FROM chatbot.user WHERE username = $1 LIMIT 1', [username])
    .then(result => {
      if (result.rowCount === 0) return res.sendStatus(401);
      const user = result.rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1h
          const token = generateAccessToken({
            id: user.id,
          }, exp);
          return res.json({
            name: user.name,
            email: user.email,
            username,
            token,
            expiresAt: exp,
          });
        }
        return res.sendStatus(401);
      });
    });
});

router.post('/signup', checkSignupParams, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;
  bcrypt.hash(password, saltRounds)
    .then(hash => {
      db.query('INSERT INTO chatbot.user (username, password, name, email) VALUES ($1,$2,$3,$4)', [username, hash, name, email])
        .then(result => res.sendStatus(200))
        .catch(err => {
          if (err.code === '23505') {
            return res.status(400).json({
              error: 'username already in use',
            });
          }
          return res.sendStatus(500);
        });
    });
});

function generateAccessToken(payload, exp) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: exp,
  });
}

function checkAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    req.userId = decoded.id;
    next();
  });
}

function checkAuthParams(req, res, next) {
  const requiredParams = ['username', 'password'];
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return res.status(400).send({
        error: `missing ${param} parameter`,
      });
    }
  }
  next();
}

function checkSignupParams(req, res, next) {
  const requiredParams = ['username', 'password', 'name', 'email'];
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return res.status(400).send({
        error: `missing ${param} parameter`,
      });
    }
  }
  next();
}

module.exports = {
  router,
  checkAccessToken,
};
