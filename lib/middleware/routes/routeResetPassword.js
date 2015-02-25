module.exports = function(req, res, done) {
  var self = this;

  self.parseResetPasswordRequest(req, res, function(err, secret, password) {
    if (err) return done(err);

    self.sendResetPassword(secret, password, function(err){
      if (err) return done(err);

      self.resetPassword(secret, password, done);
    });


  });
};