module.exports = function(userId, provider, profile, userData, done) {
  var self = this;
  var model = self.store.createModel();

  // Add timestamp
  profile.timestamp = +new Date();

  function callback(err) {
    if (err) return done(err);

    // Return userId
    done(null, userId);
  }

  // Look for user with given userId
  var $user = model.at(self.options.collection + '.' + userId);

  model.fetch($user, function(err) {
    if (err) return done(err);

    // User exist
    if ($user.get()) {
      // Error if user allready has given provider
      if ($user.get(provider)) return done(self.error('providerExists'));

      // Save provider's profile
      return $user.set(provider, profile, callback);
    }

    // If not exist, create new one with given provider
    var user = userData || {};
    user.id = userId;
    user[provider] = profile;

    model.add(self.options.collection, user, callback);
  });
}
