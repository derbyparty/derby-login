module.exports = function(userId, provider, profile, userData, done) {
  var self = this;
  var model = self.backend.createModel();

  // Add timestamp
  profile.timestamp = +new Date();

  function callback(err) {
    if (err) {
      model.close();
      return done(err);
    }

    // Return userId
    model.close();
    done(null, userId);
  }

  // Look for user with given userId
  var $user = model.at(self.options.collection + '.' + userId);

  model.fetch($user, function(err) {
    if (err) {
      model.close();
      return done(err);
    }

    // User exist
    if ($user.get()) {
      // Error if user allready has given provider
      if ($user.get(provider)) {
        model.close();
        return done(self.error('providerExists'));
      }

      // Save provider's profile
      return $user.set(provider, profile, callback);
    }

    // If not exist, create new one with given provider
    var user = userData || {};
    user.id = userId;
    user[provider] = profile;

    self.parseRegisterProvider(user, provider, profile, function(err, user) {
      if (err) {
        model.close();
        return done(err);
      }

      model.add(self.options.collection, user, callback);
    })
  });
}
