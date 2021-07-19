module.exports = function(app, options) {
  app.component(require('./changeEmail'));
  app.component(require('./changePassword'));
  app.component(require('./logout'));
  app.component(require('./logoutUser'));
};
