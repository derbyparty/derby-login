module.exports = function(app, options) {
  app.component(require('./changePassword'));
  app.component(require('./login'));
  app.component(require('./register'));
};
