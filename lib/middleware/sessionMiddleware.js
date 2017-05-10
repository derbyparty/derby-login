module.exports = function(req, res, next) {
  var self = this;
      model = req.model,
      userIndex = 0,
      userIds = req.session.userIds || [],
      userId = userIds[ userIndex ],
      url = req.url,
      multiloginSettings = this.options.multiloginSettings,
      ignoredRoutes = multiloginSettings.ignoredRoutes || [],
      passportKey = req._passport.instance._key,
      passport = req.session[ passportKey ];

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

    var isAuthenticated = _isAuthenticated(userId);

    // _session.loggedIn is the main way to distinguish auth and not auth states
    if (isAuthenticated) model.set('_session.loggedIn', true);

    // Request hook
    self.request(req, res, userId, isAuthenticated, next);
  }

  function patternToRegExp(pattern) {
    pattern = pattern.replace(/\./g, "\\.").replace(/\*/g, "([^\\.]*)");
    return new RegExp('^' + pattern + '$');
  }

  function isUrlAllowed() {
    var isAllowed = true;

    for(var i = 0; i < ignoredRoutes.length; i++) {
      var regexp = patternToRegExp(ignoredRoutes[i]);
      if(regexp.test(url)) {
        isAllowed = false;
        break;
      }
    }

    return isAllowed;
  }

  if (!userId) {
    userId = model.id();
    userIds = req.session.userIds = [ userId ];
    return done();
  }

  if (multiloginSettings && isUrlAllowed()) {
    var userIndexRegExp = /^\/u\/(\d+)(\/|$)/,
        urlParts = url.split('?'),
        pathName = urlParts[0];

    if (userIndexRegExp.test(pathName)) {
      userIndex = pathName.match(userIndexRegExp)[1];
      userId = userIds[ userIndex ];
      if (!userId) return res.redirect(url.replace(userIndexRegExp, '/u/0/'));
    } else {
      return res.redirect('/u/0' + url);
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
