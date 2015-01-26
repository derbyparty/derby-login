module.exports = function(req, req, done) {
  var self = this;

  self.parseResetPasswordRequest(req, res, function(err, secret, password) {
    if (err) return done(err);

    self.resetPassword(secret, password, done);
  });
};