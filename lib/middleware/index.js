var extend = require('extend');
var ms = require('ms');
var Login = require('../Login');
var defaultOptions = require('../defaultOptions');

require('./routes');

Login.prototype.routesMiddleware = require('./routesMiddleware');
Login.prototype.sessionMiddleware = require('./sessionMiddleware');

Login.prototype.middleware = function(backend, options) {

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

  this.backend = backend;

  // Create projection of db collection to protect sensitive data

  backend.addProjection(options.publicCollection, options.collection, options.user);

  this.initCrypt();
  this.initStrategies();

  var self = this;

  return function (req, res, next) {
    self._passport.initialize(options.passport)(req, res, function(err) {
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
