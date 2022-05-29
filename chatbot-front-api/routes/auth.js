/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const router = express.Router();

router.use('/', (req, res, next) => {
  const requiredParams = ['username', 'password'];
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return res.status(400).send({
        error: `missing ${param} parameter`,
      });
    }
  }
  next();
});

router.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (password === 'senha') {
    const token = generateAccessToken({
      username,
    });
    return res.json(token);
  }
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds)
    .then(hash => res.json({
      username,
      password,
      passwordHash: hash,
    }));
});

function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.TOKEN_SECRET, {
    expiresIn: '5min',
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

module.exports = {
  router,
  checkAccessToken,
};
