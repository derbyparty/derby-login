module.exports = function(email, password, done) {
  var self = this;
  self.getUserByEmail(email, function(err, $user) {
    if (err) return done(err);

    self.passwordMatch($user, password, function(err, match) {
      if (err) return done(err);
      if (!match) return done(self.error('wrongPassword'));

      // Return userId
      return done(null, $user.get('id'));
    });
  });
}
