const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const express = require('express');
const cors = require('cors');

const mountRoutes = require('./routes');

const app = express();
const envs = dotenv.config();
dotenvExpand.expand(envs);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'with he4rt by softawii');
  next();
});

mountRoutes(app);

app.get('/', (req, res) => {
  res.send('nice to meet you');
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({
      message: err.message,
    });
  }
  console.log(err);
  res.status(500).send('Something is wrong 😔');
});

module.exports = app;
