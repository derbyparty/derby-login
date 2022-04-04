module.exports = function(userId, email, done) {
  var self = this;
  var model = self.backend.createModel();

  email = email.toLowerCase();

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

    if ($user.get(self.options.emailField) === email) return done(self.error('equalEmails'));

    if (self.options.confirmRegistration) {
      var emailChange = {
        email: email,
        timestamp: +new Date()
      }
      $user.set(self.options.localField + '.' + self.options.emailChangeField, emailChange, function() {
        model.close();
        return done();
      });
    } else {
      $user.set(self.options.emailField, email, function() {
        model.close();
        return done();
      });
    }

  });
}
