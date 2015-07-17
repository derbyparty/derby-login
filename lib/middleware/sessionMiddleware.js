module.exports = function(req, res, next) {
  var self = this;
  var model = req.getModel();
  
  var userId = req.session.userId;
  
  function done() {
    // Put userId to session and model
    model.set('_session.userId', userId);

    var isAuthenticated = req.isAuthenticated();

    // _session.loggedIn is the main way to distinguish auth and not auth states
    if (isAuthenticated) model.set('_session.loggedIn', true);

    // Request hook
    self.request(req, res, userId, isAuthenticated, next);
  }
  
  if (!userId) {
    userId = req.session.userId = model.id();
    return done();
  }
  
  var $user = model.at('users.' + userId);
  model.fetch($user, function(err) {
    if (err) return next(err);
    
    if (!$user.get() && req.isAuthenticated()) {
      // This happens when user was deleted from database, but his session not
      self.logout(req);
    }
    
    done();
  });
};
