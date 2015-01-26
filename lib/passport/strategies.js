module.exports = function() {
  var self = this;

  var strategies = self.options.strategies;

  for (var name in strategies) {
    var Strategy = strategies[name].strategy;
    var strategyOptions = strategies[name].conf;

    // Be sure to pass req
    strategyOptions.passReqToCallback = true;

    // Add strategy to passport
    self._passport.use(new Strategy(strategyOptions, self.verifyCallback.bind(self)));
  }
};