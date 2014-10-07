module.exports = function() {
  var self = this;

  function verifyCallback(req, accessToken, refreshToken, profile, done) {
    // Try to find existent users with this profile id
    var model = req.getModel();

    var query = { $limit: 1 };
    query[profile.provider + '.id'] = profile.id;
    var $providerQuery = model.query(self.options.collection, query);

    model.fetch($providerQuery, function(err) {
      if (err) return done(err);

      var user = $providerQuery.get()[0];
      // If there is user, no need to register new one. Return to router to login
      if (user) return done(null, user.id);

      // Maybe we need these tokens someday
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      // Register new user or add provider to current user
      self.registerProvider(req.session.userId, profile.provider, profile, null, done);
    });
  }

  var strategies = self.options.strategies;

  for (var name in strategies) {
    var Strategy = strategies[name].strategy;
    var strategyOptions = strategies[name].conf;

    // Be sure to pass req
    strategyOptions.passReqToCallback = true;

    // Add strategy to passport
    self._passport.use(new Strategy(strategyOptions, verifyCallback));
  }
}
