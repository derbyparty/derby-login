var extend = require('extend');
var ms = require('ms');
var Login = require('../Login');
var defaultOptions = require('../defaultOptions');

Login.prototype.routesMiddleware = require('./routes');
Login.prototype.sessionMiddleware = require('./session');

Login.prototype.middleware = function(store, options) {

  this.options = options = extend(true, defaultOptions, options);

  // Move hooks to module directly, so they have access to it as context
  for (var name in this.options.hooks) {
    var fn = this.options.hooks[name];
    this[name] = fn;
  }
  delete this.options.hooks;

  if (typeof this.options.confirmEmailTimeLimit === 'string')
    this.options.confirmEmailTimeLimit = ms(this.options.confirmEmailTimeLimit);

  if (typeof this.options.resetPasswordTimeLimit === 'string')
    this.options.resetPasswordTimeLimit = ms(this.options.resetPasswordTimeLimit);

  this.store = store;

  // Create projection of db collection to protect sensitive data
  store.shareClient.backend.addProjection(options.publicCollection, options.collection, 'json0', options.user);

  this.initCrypt();
  this.initStrategies();

  var self = this;

  return function (req, res, next) {
    self._passport.initialize()(req, res, function(err) {
      if(err) return next(err);
      self._passport.session()(req, res, function(err) {
        if(err) return next(err);
        self.sessionMiddleware(req, res, function(err) {
          if(err) return next(err);
          self.routesMiddleware(req, res, next);
        });
      });
    });
  };
};
