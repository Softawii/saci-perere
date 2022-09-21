/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const status = require('http-status');
const { prisma } = require('../db');
const { generateRandomPassword, hashSaltRounds } = require('../util');

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
      return res.status(status.FORBIDDEN).json({
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
          isadmin: user.isadmin,
          token,
          expiresAt: exp,
        });
      }
      return res.sendStatus(status.FORBIDDEN);
    });
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to signin',
    });
  });
});

router.post('/signup', checkAccessToken, checkSignupParams, (req, res) => {
  const username = req.body.username;
  const password = generateRandomPassword();
  const name = req.body.name;
  const email = req.body.email;
  bcrypt.hash(password, hashSaltRounds)
    .then(hash => {
      prisma.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
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
            res
              .status(status.CREATED)
              .json({
                username,
                password,
                name,
                email,
              });
          }).catch(reason => {
            console.error(reason);
            res.status(status.BAD_REQUEST).json({
              message: 'failed to create user',
            });
          });
        } else {
          res.status(status.BAD_REQUEST).json({
            message: 'username or email already in use',
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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(status.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.sendStatus(status.UNAUTHORIZED);
      }
      console.error(err);
      return res.sendStatus(status.FORBIDDEN);
    }

    req.userId = decoded.id;
    next();
  });
}

function isUserAuthenticated(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return {
      isAuthenticated: true,
      userId: decoded.id,
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { isAuthenticated: false };
    }
    console.error(err);
    return { isAuthenticated: false };
  }
}

function checkAuthParams(req, res, next) {
  const requiredParams = ['username', 'password'];
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return res.status(status.BAD_REQUEST).send({
        error: `missing ${param} parameter`,
      });
    }
  }
  next();
}

function checkSignupParams(req, res, next) {
  const requiredParams = ['username', 'name', 'email'];
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return res.status(status.BAD_REQUEST).send({
        error: `missing ${param} parameter`,
      });
    }
  }
  next();
}

module.exports = {
  router,
  checkAccessToken,
  isUserAuthenticated,
};
