module.exports = function(app, options) {
  app.component(require('./changeEmail'));
  app.component(require('./changePassword'));
  app.component(require('./login'));
  app.component(require('./logout'));
  app.component(require('./logoutUser'));
  app.component(require('./recoverPassword'));
  app.component(require('./register'));
  app.component(require('./resetPassword'));
};
