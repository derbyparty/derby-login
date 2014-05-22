var passport = require('passport');

module.exports = function(options) {

  function middleware (req, res, next) {
    var model = req.getModel();
    var userId = req.session.userId;
    if (!userId) userId = req.session.userId = model.id();
    model.set('_session.userId', userId);

    if (req.isAuthenticated()) {
      $user = model.at(options.collection + '.' + userId);
      $publicUser = model.at(options.publicCollection + '.' + userId);
      model.fetch($user, $publicUser, function(err) {
        model.set('_session.loggedIn', true);
        model.ref('_session.user', $publicUser);
        $user.set('timestamps.loggedin', +new Date());
        model.unfetch($user, next);
      })
    } else {
      next();
    }
  }

  return function (req, res, next) {
    passport.initialize()(req, res, function() {
      passport.session()(req, res, function() {
        middleware(req, res, next);
      });
    });
  }
}