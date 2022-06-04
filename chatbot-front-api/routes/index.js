const auth = require('./auth');
const categories = require('./categories');
const questions = require('./questions');
const answers = require('./answers');

module.exports = app => {
  app.use('/auth', auth.router);
  app.use('/categories', categories.router);
  app.use('/questions', questions.router);
  app.use('/answers', answers.router);
};
