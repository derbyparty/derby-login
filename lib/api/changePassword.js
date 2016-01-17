module.exports = function(userId, oldpassword, password, done) {
  var self = this;
  var model = self.backend.createModel();

  // Look for user with given userId
  var $user = model.at(self.options.collection + '.' + userId);
  model.fetch($user, function(err) {
    if (err) return done(err);

    if (!$user.get()) return done(self.error('noUser'));

    if (!$user.get(self.options.localField)) return done(self.error('noLocal'));

    // Check the old password
    self.passwordMatch($user, oldpassword, function(err, match) {
      if (err) return done(err);

      if (!match) return done(self.error('wrongOldPassword'));

      // Save password
      self.setPassword($user, password, done);
    });
  });
}
