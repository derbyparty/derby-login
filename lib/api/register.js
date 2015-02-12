module.exports = function(req, email, password, userData, done) {
  var self = this;
  var model = self.store.createModel();

  self.userExists(email, function(err, exist, user) {
    if (err) return done(err);

    // Return error user allready exists
    if (exist) return done(self.error('userExists'), {userId: user.id});

    // Hash the password
    self.hash(password, function(err, hash, salt) {
      if (err) return done(err);

      // Create local profile
      var profile = {};

      profile[self.options.emailChangeField] = {
        email: email,
        timestamp: +new Date()
      }
      
      profile[self.options.hashField] = hash;

      // Add the salt to the profile if we have one.
      if (salt) profile[self.options.saltField] = salt;

      // Save user with profile
      self.registerProvider(req.session.userId, self.options.localField, profile, userData, done);
    });
  });
};
