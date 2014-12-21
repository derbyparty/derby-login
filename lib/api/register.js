module.exports = function(email, password, userData, done) {
  var self = this;
  var model = self.store.createModel();

  self.userExists(email, function(err, exist, user) {
    if (err) { return done(err); }

    // Return error user allready exists
    if (exist) { return done(null, user.id); }

    // Hash the password
    self.hash(password, function(err, hash, salt) {
      if (err) { return done(err); }

      // Create local profile
      var profile = {}
      if (self.options.confirmRegistration) {
        var tp = {};
        tp[self.options.emailField] = email
        tp.timestamp = +new Date();
        profile[self.options.emailChangeField] = tp;
      } else {
        userData[self.options.emailField] = email;
      }
      profile[self.options.hashField] = hash;
      

      // Add the salt to the profile if we have one.
      if (salt) { profile[self.options.saltField] = salt; }

      // Get userId from userData or generate new one
      var userId = (userData && userData.id) || model.id();

      // Save user with profile
      self.registerProvider(userId, self.options.localField, profile, userData, done);
    });
  });
}
