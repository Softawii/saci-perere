/* eslint-disable consistent-return */
const crypto = require('crypto');
const status = require('http-status');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const objectHash = require('object-hash');
const { isUserAdmin } = require('./db');

const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()';
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS;
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS;

const hashSaltRounds = 10;

function generateRandomPassword(length = 15, alphabet = ALL_CHARS) {
  const rb = crypto.randomBytes(length);
  let rp = '';

  for (let i = 0; i < length; i++) {
    rb[i] %= alphabet.length;
    rp += alphabet[rb[i]];
  }
  return rp;
}

function checkUserIsAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(status.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.sendStatus(status.UNAUTHORIZED);
      }
      console.error(err);
      return res.sendStatus(status.FORBIDDEN);
    }

    if (!(await isUserAdmin(decoded.id))) {
      return res.sendStatus(status.UNAUTHORIZED);
    }
    req.userId = decoded.id;
    next();
  });
}

function checkContainsIdParam(req, res, next) {
  const id = Number(req.params.id, 10);
  if (!id) {
    return res.status(status.BAD_REQUEST).send({
      error: 'invalid id param',
    });
  }
  if (Number.isNaN(id)) {
    return res.status(status.BAD_REQUEST).send({
      error: 'id is not a number',
    });
  }
  req.params.id = id;
  return next();
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

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
  generateRandomPassword,
  hashSaltRounds,
  checkUserIsAdmin,
  checkContainsIdParam,
  checkAccessToken,
  isUserAuthenticated,
  validateRequest,
  cache: new NodeCache({
    stdTTL: 120,
    checkperiod: 60,
    useClones: false,
  }),
  objectHash,
};
