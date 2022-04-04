module.exports = function(secret, password, done) {
  var self = this;

  self.getUserBySecret(secret, function(err, $user) {
    if (err) {
      $user.close();
      return done(err);
    }

    var timestamp = $user.get(self.options.localField + '.passwordReset.timestamp');
    var now = +new Date();
    if (timestamp + self.options.resetPasswordTimeLimit < now) {
      $user.close();
      return done(self.error('resetPasswordExpired'));
    }

    // Save password
    self.setPassword($user, password, function(err) {
      if (err) {
        $user.close();
        return done(err);
      }

      // Delete secret
      $user.del(self.options.localField + '.passwordReset', function() {
        $user.close();
        done();
      });
    });
  });
}
