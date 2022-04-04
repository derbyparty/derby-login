module.exports = function(userId, done) {
  var self = this;
  var model = self.backend.createModel();

  // Look for user with given userId
  var $user = model.at(self.options.collection + '.' + userId);
  model.fetch($user, function(err) {
    if (err) {
      model.close();
      return done(err);
    }

    if (!$user.get()) {
      model.close();
      return done(self.error('noUser'));
    }

    if (!$user.get(self.options.localField)) {
      model.close();
      return done(self.error('noLocal'));
    }

    var emailChange = $user.get(self.options.localField + '.' + self.options.emailChangeField);
    if (!emailChange) {
      model.close();
      return done(self.error('alreadyConfirmed'));
    }

    var now = +new Date();
    if (emailChange.timestamp + self.options.confirmEmailTimeLimit < now) {
      model.close();
      return done(self.error('confirmationExpired'));
    }

    $user.set(self.options.emailField, emailChange.email, function(err) {
      if (err) {
        model.close();
        return done(err);
      }

      $user.del(self.options.localField + '.' + self.options.emailChangeField, function() {
        model.close();
        return done();
      });
    });
  });
}
