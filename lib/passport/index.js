var passport = require('passport');
var Login = require('../Login');

// As far as we store only userId in session
// there is no need to serialize/deserialize user
// With userId we can subscribe to user in router
passport.serializeUser(function(req, userId, done) {
  var user = req._passport.session.user;

  if (user) {
    // user has new format of session
    if (Array.isArray(user)) {
      if (user.indexOf(userId) === -1) user.push(userId);
    } else {
      // override old session format to new
      user = [ user ];
    }
  } else {
    // user has no session
    user = [ userId ];
  }

  req.session.userIds = user;

  done(null, user);
});

passport.deserializeUser(function(req, userIds, done) {
  done(null, userIds);
});

Login.prototype._passport = passport;

Login.prototype.initStrategies = require('./strategies');
