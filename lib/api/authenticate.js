module.exports = function(email, password, done) {
  var self = this;

  email = email.toLowerCase();

  self.getUserByEmail(email, function(err, $user) {
    if (err) {
      $user.close();
      return done(err);
    }

    self.passwordMatch($user, password, function(err, match) {
      if (err) {
        $user.close();
        return done(err);
      }
      if (!match) {
        $user.close();
        return done(self.error('wrongPassword'));
      }

      // Return userId
      var userId = $user.get('id')
      $user.close();
      return done(null, userId);
    });
  });
}
