module.exports = function(app, options) {
  app.component(require('./login'));
  app.component(require('./recoverPassword'));
  app.component(require('./register'));
  app.component(require('./resetPassword'));
};
