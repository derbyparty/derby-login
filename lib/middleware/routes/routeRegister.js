module.exports = function(req, res, done) {
  var self = this;

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
};