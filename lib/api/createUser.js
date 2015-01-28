module.exports = function(email, pwd, userData, done) {
  var self    = this,
      errors  = self.options.errors;

  self.register(email, pwd, userData, function (err, uID) {
    if (err && (err.message !== errors.userExists)) {
      return done(err);
    }
    
    if (self.options.confirmRegistration) {
      self.confirmEmail(uID, function (err) { return done(err); });
    } else {
      return done(null);
    }
  });
}

