var passport = require('passport');
var Login = require('../Login');

// As far as we store only userId in session
// there is no need to serialize/deserialize user
// With userId we can subscribe to user in router
passport.serializeUser(function(req, userId, done) {
  var user = req._passport.session.user;

  if (!user) {
    user = [ userId ];
  } else {
    if (Array.isArray(user)) {
      if (user.indexOf(userId) === -1) user.push(userId);
    } else {
      user = [ user ];
    }
  }

  req.session.userIds = user;

  done(null, user);
});

passport.deserializeUser(function(req, userId, done) {
  done(null, req.session.userId);
});

Login.prototype._passport = passport;

Login.prototype.initStrategies = require('./strategies');
