module.exports = function(req, req, done) {
  var self = this;

  self.parseConfirmEmailRequest(req, res, function(err, userId) {
    if (err) return done(err);

    self.confirmEmail(userId, function(err) {
      if (err) return done(err);

      self.login(userId, req, done);
    });
  });
};