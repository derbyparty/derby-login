module.exports = function(req, res, next) {
  var self = this;
  var model = req.getModel();

  // Generate new userId if absent and put it to session and model
  var userId = req.session.userId;
  if (!userId) userId = req.session.userId = model.id();
  model.set('_session.userId', userId);

  var isAuthenticated = req.isAuthenticated();

  // _session.loggedIn is the main way to distinguish auth and not auth states
  if (isAuthenticated) model.set('_session.loggedIn', true);

  // Request hook
  self.request(req, res, userId, isAuthenticated, next);
};
