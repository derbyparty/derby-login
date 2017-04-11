module.exports = function(req, res, next) {
  var self = this;
  var model = req.model;

  var userId = req.session.userId,
      userIds = req.session.userIds;

  function done() {
    // Put userId to session and model
    model.set('_session.userId', userId);
    model.set('_session.userIds', userIds);

    var isAuthenticated = req.isAuthenticated();

    // _session.loggedIn is the main way to distinguish auth and not auth states
    if (isAuthenticated) model.set('_session.loggedIn', true);

    // Request hook
    self.request(req, res, userId, isAuthenticated, next);
  }

  if (!userId) {
    userId = req.session.userId = model.id();
    userIds = req.session.userIds = [ userId ];
    return done();
  }

  var $user = model.at(this.options.publicCollection + '.' + userId);

  model.fetch($user, function(err) {
    if (err) return next(err);

    if (req.isAuthenticated() && (!$user.get() || !userIds)) {
      // This happens when user was deleted from database, but his session not
      // or his session is in old format
      self.logout(req);
    }

    done();
  });
};
