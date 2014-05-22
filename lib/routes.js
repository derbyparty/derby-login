var passport = require('passport');
var auth = require('./auth');
var validation = require('./validation');

function parseError(err) {
  var data = {};
  if (!err) return { success: true };
  else if (err instanceof Error) data.error = err.message;
  else if (typeof err === 'string') data.error = err;
  else if (err.message) data.error = err.message;
  else data = err;
  return data;
}

module.exports = function (expressApp, options) {

  // Change Password
  expressApp.post('/auth/changepassword', function(req, res, next) {
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
    })
  });

  // Login
  expressApp.post('/auth/login', function (req, res, next) {
    // Get user with local strategy
    passport.authenticate('local', options.passport, function(err, user, info) {
      // Error
      if (err || info) return res.json(parseError(err || info));
      // Success and actually login
      auth.login(user, req, function(err) {
        return res.json(parseError(err));
      });
    })(req, res);
  });

  // Logout
  expressApp.get('/auth/logout', function(req, res, next) {
    req.logout();
    delete req.session.userId;
    return res.redirect(options.passport.successRedirect);
  });

  // Register
  expressApp.post('/auth/register', function (req, res, next) {
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
  });

  // Strategies
  for (var name in options.strategies) {
    var strategyObj = options.strategies[name];
    var conf = strategyObj.conf || {};

    expressApp.get('/auth/' + name, passport.authenticate(name, conf), function() {});

    expressApp.get('/auth/' + name + '/callback', passport.authenticate(name, options.passport), function(req, res) {
      res.redirect(options.passport.successRedirect);
    });
  }
}