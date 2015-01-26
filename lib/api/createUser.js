module.exports = function(email, pwd, userData, done) {
  var self = this;

  self.register(email, pwd, userData, function (err, uID) {
    if (err) { return done(err); }
    if (self.options.confirmRegistration) {
      self.confirmEmail(uID, function (err) { return done(err); });
    } else {
      return done(null);
    }
    }
  });
}

