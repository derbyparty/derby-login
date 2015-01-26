module.exports = function(req, req, done) {
  var self = this;

  self.parseRecoverPasswordRequest(req, res, function(err, email) {
    if (err) return done(err);

    self.resetPasswordSecret(email, function(err, secret, userId) {
      if (err) return done(err);

      self.sendRecoveryConfirmation(userId, email, secret, done);
    });
  });
};