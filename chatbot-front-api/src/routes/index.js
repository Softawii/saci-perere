const auth = require('./auth');
const categories = require('./categories');
const questions = require('./questions');
const answers = require('./answers');
const report = require('./report');
const user = require('./user');
const topics = require('./topics');
const platform = require('./platforms');
const history = require('./history');
const feedback = require('./feedback');

module.exports = app => {
  app.use('/auth', auth.router);
  app.use('/category', categories.router);
  app.use('/question', questions.router);
  app.use('/answer', answers.router);
  app.use('/report', report.router);
  app.use('/user', user.router);
  app.use('/topic', topics.router);
  app.use('/platform', platform.router);
  app.use('/history', history.router);
  app.use('/feedback', feedback.router);
};
