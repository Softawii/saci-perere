const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const auth = require('./routes/auth');
const categories = require('./routes/categories');

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(
  auth.router,
  categories.router,
);

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'with he4rt by softawii');
  next();
});

app.get('/', (req, res) => {
  res.send('nice to meet you');
});

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: '1800s',
  });
}

app.post('/auth', (req, res) => {
  const token = generateAccessToken({
    username: req.body.username,
  });

  res.json(token);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
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
