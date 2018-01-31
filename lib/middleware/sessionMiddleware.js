module.exports = function(req, res, next) {
  var self = this,
      model = req.model,
      userIndex = 0,
      _userIndex = req.session.userIndex,
      userIds = req.session.userIds || [],
      userId = null,
      url = req.url,
      multiloginSettings = (this.options.multiloginSettings || {}).general || {},
      ignoredRoutes = multiloginSettings.ignoredRoutes || [],
      multilogin = multiloginSettings.multilogin,
      passportKey = req._passport.instance._key,
      passport = req.session[ passportKey ];

  if (!multilogin && userIds.length > 1) this.logout(req);

  if (passport && !Array.isArray(passport.user) && req.isAuthenticated()) {
    this.logout(req);
  }

  function _isAuthenticated(userId) {
    var property = 'user';

    if (req._passport && req._passport.instance) {
      property = req._passport.instance._userProperty || 'user';
    }

    return ((req[ property ] || []).indexOf(userId) !== -1) ? true : false;
  }

  function done() {
    // Put userId to session and model
    model.set('_session.userId', userId);
    model.set('_session.userIds', userIds);
    model.set('_session.userIndex', userIndex);
    if (multilogin) model.set('_session.multilogin', true);

    var isAuthenticated = _isAuthenticated(userId);

    // _session.loggedIn is the main way to distinguish auth and not auth states
    if (isAuthenticated) model.set('_session.loggedIn', true);

    if (req.session.userId != userId) req.session.userId = userId;
    // Request hook
    self.request(req, res, userId, isAuthenticated, next);
  }

  function patternToRegExp(pattern) {
    pattern = pattern.replace(/\./g, "\\.").replace(/\*/g, "([^\\.]*)");
    return new RegExp('^' + pattern + '$');
  }

  function isUrlAllowed() {
    var isAllowed = true,
        _ignoredRoutes = ['/build/client*'].concat(ignoredRoutes);

    for (var i = 0; i < _ignoredRoutes.length; i++) {
      if (patternToRegExp(_ignoredRoutes[i]).test(url)) {
        isAllowed = false;
        break;
      }
    }

    return isAllowed;
  }

  if (multilogin) {
    if (!req.session.multilogin) req.session.multilogin = true;
  } else {
    delete req.session.multilogin;
  }

  // this userIndex we need when user login for redirect
  if (typeof _userIndex !== "undefined" && _userIndex !== null) {
    userIndex = _userIndex;
    delete req.session.userIndex;
  }

  userId = userIds[ userIndex ];

  if (!userId) {
    userId = model.id();
    userIds = req.session.userIds = [ userId ];
  }

  if (multilogin && isUrlAllowed()) {
    // url types are /u/:userIndex/route, userIndex is integer
    var userIndexRegExp = /^\/u\/(\d+)(\/|\?|$)/,
        urlParts = url.split('?'),
        pathName = urlParts[0];

    if (userIndexRegExp.test(pathName)) {
      userIndex = pathName.match(userIndexRegExp)[1];
      userId = userIds[ userIndex ];
      // redirect to first user if does not exist userId for this userIndex
      if (!userId) return res.redirect(url.replace(userIndexRegExp, '/u/0/'));
    } else {
      return res.redirect('/u/' + userIndex + url);
    }
  }

  var $user = model.at(this.options.publicCollection + '.' + userId);

  model.fetch($user, function(err) {
    if (err) return next(err);

    if (!$user.get() && _isAuthenticated(userId)) {
      // This happens when user was deleted from database, but his session not
      self.logout(req);
    }

    done();
  });
};
