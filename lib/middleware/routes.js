module.exports = function(req, res, next) {
  var self = this;

  // Catch /auth/:methodOrProvider and /auth/:provider/callback routes
  var parts = req.path.slice(1).split('/');

  if (parts[0] !== 'auth') return next();

  var method = parts[1];

  function done(err) {
    self.response(err, method, req, res);
  }

  switch (method) {

    case 'changeemail':
      self.parseChangeEmailRequest(req, res, function(err, email) {
        if (err) return done(err);

        self.changeEmail(req.session.userId, email, function(err) {
          if (err) return done(err);

          self.sendChangeEmailConfirmation(req.session.userId, email, done);
        });
      });

      break;

    case 'changepassword':
      self.parseChangePasswordRequest(req, res, function(err, oldpassword, password) {
        if (err) return done(err);

        self.changePassword(req.session.userId, oldpassword, password, done);
      });

      break;

    case 'recoverpassword':
      self.parseRecoverPasswordRequest(req, res, function(err, email) {
        if (err) return done(err);

        self.resetPasswordSecret(email, function(err, secret, userId) {
          if (err) return done(err);

          self.sendRecoveryConfirmation(userId, email, secret, done);
        });
      });

      break;

    case 'resetpassword':
      self.parseResetPasswordRequest(req, res, function(err, secret, password) {
        if (err) return done(err);

        self.resetPassword(secret, password, done);
      });

      break;

    case 'login':
      self.parseLoginRequest(req, res, function(err, email, password) {
        if (err) return done(err);

        self.authenticate(email, password, function(err, userId) {
          if (err) return done(err);

          self.login(userId, req, done);
        });
      });

      break;

    case 'logout':
      self.logout(req);
      done();

      break;

    case 'register':
      self.parseRegisterRequest(req, res, function(err, email, password, userData) {
        if (err) return done(err);

        self.register(email, password, userData, function(err, userId) {
          if (err) return done(err);

          if (self.options.confirmRegistration) {
            self.sendRegistrationConfirmation(userId, email, done);
          } else {
            self.confirmEmail(userId, function(err) {
              if (err) return done(err);

              self.login(userId, req, done);
            });
          }
        });
      });

      break;

    case 'confirmregistration':
    case 'confirmemailchange':
      self.parseConfirmEmailRequest(req, res, function(err, userId) {
        if (err) return done(err);

        self.confirmEmail(userId, function(err) {
          if (err) return done(err);

          self.login(userId, req, done);
        });
      });

      break;

    default:
      // Try to find provider
      var provider = method;
      var strategy = self.options.strategies[provider];

      // Return error if no provider
      if (!strategy) return next(new Error('Unknown auth provider: ' + provider));

      var strategyOptions = strategy.conf || {};

      if (parts[2] === 'callback') {
        // User is redirected here from provider's page
        self._passport.authenticate(provider, self.options.passport, function(err, userId) {
          // Auth failed, return error
          if (err) return done(err);

          // Everything is ok, login user
          self.login(userId, req, done);
        })(req, res, function() {});

      } else {
        // User tries to login with provider, he will be redirected to provider's page
        self._passport.authenticate(provider, strategyOptions)(req, res, function() {});
      }
  }
};
