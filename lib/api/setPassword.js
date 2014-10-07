module.exports = function($user, password, done) {
  var self = this;

  // Set the new password hash
  self.hash(password, function(err, hash, salt) {
    if (err) return done(err);

    // Set the new hash
    $user.set(self.options.localField + '.' + self.options.hashField, hash, function(err) {
      if (err) return done(err);

      // If we don't have a salt (E.g. using bcrypt) we're done
      if (!salt) return done();

      // Otherwise, set the new salt
      $user.set(self.options.localField + '.' + self.options.saltField, salt, function(err) {
        if (err) return done(err);

        return done();
      });
    });
  });
}
