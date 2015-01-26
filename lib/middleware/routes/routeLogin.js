module.exports = function(req, req, done) {
  var self = this;

  self.parseLoginRequest(req, res, function(err, email, password) {
    if (err) return done(err);

    self.authenticate(email, password, function(err, userId) {
      if (err) return done(err);

      self.login(userId, req, done);
    });
  });
};