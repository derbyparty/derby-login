var passport = require('passport');
var Login = require('../Login');

// As far as we store only userId in session
// there is no need to serialize/deserialize user
// With userId we can subscribe to user in router
passport.serializeUser(function(userId, done) {
  done(null, userId);
});

passport.deserializeUser(function(userId, done) {
  done(null, userId);
});

Login.prototype._passport = passport;

Login.prototype.initStrategies = require('./strategies');
