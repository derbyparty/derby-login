module.exports = function(email, pwd, userData, done) {
  var cb      = done,
      data    = userData,
      self    = this,
      errors  = self.options.errors;
  
  // userData is optional
  if (typeof data === 'function') {
    cb = data;
    data = {};
  }

  self.register(email, pwd, data, function (err, uID) {
    if (err && (err.message !== errors.userExists)) {
      return cb(err);
    }
    
    if (self.options.confirmRegistration) {
      self.confirmEmail(uID.userId, function (err) {
        if (err && (err.message !== errors.alreadyConfirmed)) {
          return cb(err);
        } else {
          return cb(null);
        }
      });
    } else {
      return cb(null);
    }
  });
}

