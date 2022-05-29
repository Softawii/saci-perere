const express = require('express');
const auth = require('./auth');
const categories = require('./categories.json');

const router = express.Router();

router.get('/', auth.checkAccessToken, (req, res) => {
  res.json(categories);
});

module.exports = {
  router,
};
