module.exports = function(email, password, userData, done) {
  var self = this;
  var model = self.store.createModel();

  self.userExists(email, function(err, exist) {
    if (err) return done(err);

    // Return error user allready exists
    if (exist) return done(self.error('userExists'));

    // Hash the password
    self.hash(password, function(err, hash, salt) {
      if (err) return done(err);

      // Create local profile
      var profile = {
        emailChange: {
          email: email,
          timestamp: +new Date()
        }
      };
      profile[self.options.hashField] = hash;

      // Add the salt to the profile if we have one.
      if (salt) profile[self.options.saltField] = salt;

      // Get userId from userData or generate new one
      var userId = (userData && userData.id) || model.id();

      // Save user with profile
      self.registerProvider(userId, self.options.localField, profile, userData, done);
    });
  });
}
