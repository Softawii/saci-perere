/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { prisma } = require('../db');

const saltRounds = 10;

const router = express.Router();

router.post('/signin', checkAuthParams, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  prisma.user.findUnique({
    where: {
      username,
    },
  }).then(user => {
    if (!user) {
      return res.status(403).json({
        message: 'wrong credentials',
      });
    }
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
  }).catch(reason => {
    console.error(reason);
    res.status(500).json({
      message: 'failed to signin',
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
      // TODO: check for username and email
      prisma.user.findUnique({
        where: {
          username,
        },
      }).then(user => {
        if (!user) {
          prisma.user.create({
            data: {
              username,
              password: hash,
              name,
              email,
            },
          }).then(() => {
            res.sendStatus(201);
          }).catch(reason => {
            console.error(reason);
            res.status(400).json({
              message: 'failed to create user',
            });
          });
        } else {
          res.status(400).json({
            message: 'username already in use',
          });
        }
      });
    });
});

function generateAccessToken(payload, exp) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: exp,
  });
}

function checkAccessToken(req, res, next) {
  req.userId = 3;
  return next();
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.sendStatus(401);
      }
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
