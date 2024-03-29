/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const status = require('http-status');
const { body } = require('express-validator');
const { prisma } = require('../db');
const {
  generateRandomPassword, hashSaltRounds, checkAccessToken, validateRequest,
} = require('../util');

const router = express.Router();

router.post('/signin', body(['username', 'password']).isString(), validateRequest, (req, res) => {
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
        const exp = '6h';
        const token = generateAccessToken({
          id: user.id,
        }, exp);
        return res.json({
          name: user.name,
          email: user.email,
          username,
          isadmin: user.isadmin,
          token,
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

router.post('/signup', checkAccessToken, body(['username', 'name']).isString(), body('email').isEmail(), validateRequest, (req, res) => {
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

module.exports = {
  router,
};
