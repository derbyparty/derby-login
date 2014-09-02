var debug = require('debug')('auth:routes');
var passport = require('passport');
var auth = require('./auth');
var validation = require('./validation');

module.exports = function (options) {

  function parseError(err) {
    var data = {};
    if (!err) return { success: true, url: options.passport.successRedirect };
    else if (err instanceof Error) data.error = err.message;
    else if (typeof err === 'string') data.error = err;
    else if (err.message) data.error = err.message;
    else data = err;
    debug('error', data);
    return data;
  }

  return function(req, res, next) {
    var parts = req.path.slice(1).split('/');
    var method = parts[1];
    debug('routes', parts);
    if (parts[0] === 'auth') {
      switch (method) {

        case 'changepassword':
          var model = req.getModel();

          var data = {
            oldpassword: req.body.oldpassword,
            password: req.body.password,
            confirm: req.body.confirm
          }
          var errors = validation.validate(data);
          if (validation.any(errors)) return res.json(errors);

          auth.changePassword(data.oldpassword, data.password, req.session.userId, model, function(err) {
            res.json(parseError(err));
          });
          break;

        case 'login':
          // Get user with local strategy
          passport.authenticate('local', options.passport, function(err, user, info) {
            // Error
            if (err || info) return res.json(parseError(err || info));
            // Success and actually login
            auth.login(user, req, function(err) {
              return res.json(parseError(err));
            });
          })(req, res);
          break;

        case 'logout':
          req.logout();
          delete req.session.userId;
          return res.redirect(options.passport.failureRedirect);
          break;

        case 'register':
          var model = req.getModel();

          var data = {
            email: req.body.email,
            password: req.body.password,
            confirm: req.body.confirm
          }
          var errors = validation.validate(data);
          if (validation.any(errors)) return res.json(errors);

          auth.register(data.email, data.password, req.session.userId, model, req, res, function(err) {
            res.json(parseError(err));
          });
          break;

        default:
          var strategy = options.strategies[method];
          if (!strategy) {
            return next(new Error('Unknown auth strategy: ' + method));
          } else {
            var conf = strategy.conf || {};
            if (parts[2] === 'callback') {
              passport.authenticate(method, options.passport)(req, res, function(req, res) {
                if (res) {
                  res.redirect(options.passport.successRedirect);
                }
              });
            } else {
              passport.authenticate(method, conf)(req, res, function() {});
            }
          }
      }

    } else {
      next();
    }
  }
}
