module.exports = function(req, res, next) {
  var self = this,
      model = req.model,
      userId = req.session.userId,
      userIds = req.session.userIds,
      url = req.url,
      urlParts = url.split('?'),
      pathName = urlParts[0],
      queryString = urlParts[1],
      multiloginSettings = this.options.multiloginSettings,
      ignoredRoutes = multiloginSettings.ignoredRoutes || [];

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

  function redirectToCorrectUser (){
    // we need to replace incorrect parts of multilogin url if they are present
    // e.g: /, /u, /u/, /u/:userId (userId is not integer)
    url = pathName.replace(/\/u(.*)$|\/$/, '');
    url += '/u/' + userIndex;
    if (queryString) url += '?' + queryString;
    return res.redirect(url);
  }

  if (multiloginSettings && ignoredRoutes.indexOf(pathName) === -1) {
    var userIndex = null,
        // url types are .../u/:userIndex, userIndex is integer
        userIndexRegExp = /u\/(\d+)\/?$/;

    if (userIndexRegExp.test(pathName)) {
      userIndex = pathName.match(userIndexRegExp)[1];
      userId = userIds[ userIndex ];
      if (!userId) {
        userIndex = 0;
        return redirectToCorrectUser();
      }
      req.session.userId = userId;
    } else {
      userIndex = userIds.indexOf(userId);
      return redirectToCorrectUser();
    }
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
