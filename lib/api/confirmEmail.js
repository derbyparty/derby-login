module.exports = function(userId, done) {
  var self = this;
  var model = self.store.createModel();

  // Look for user with given userId
  var $user = model.at(self.options.collection + '.' + userId);
  model.fetch($user, function(err) {
    if (err) return done(err);

    if (!$user.get()) return done(self.error('noUser'));

    if (!$user.get(self.options.localField)) return done(self.error('noLocal'));

    var emailChange = $user.get(self.options.localField + '.emailChange');
    if (!emailChange) return done(self.error('alreadyConfirmed'));

    var now = +new Date();
    if (emailChange.timestamp + self.options.confirmEmailTimeLimit < now)
      return done(self.error('confirmationExpired'));

    $user.set(self.options.emailField, emailChange.email, function(err) {
      if (err) return done(err);

      $user.del(self.options.localField + '.emailChange', done);
    });
  });
}
