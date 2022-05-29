const auth = require('./auth');
const categories = require('./categories');

module.exports = app => {
  app.use('/auth', auth.router);
  app.use('/categories', categories.router);
};
