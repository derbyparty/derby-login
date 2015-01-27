module.exports = function(req, res, done) {
  var self = this;

  self.parseLoginRequest(req, res, function(err, email, password) {
    if (err) return done(err);

    self.authenticate(email, password, function(err, userId) {
      if (err) return done(err);

      self.login(userId, req, function(err){
        if (err) return done(err);
        done(null, {userId: userId});
      });
    });
  });
};