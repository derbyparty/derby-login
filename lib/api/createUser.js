function finalize (model, cb, cbParam) {
  model.close();
  return cb(cbParam);
}

module.exports = function(email, pwd, userData, done) {
  var cb      = done,
      data    = userData,
      self    = this,
      errors  = self.options.errors,
      model   = self.backend.createModel();
  
  // userData is optional
  if (typeof data === 'function') {
    cb = data;
    data = {};
  }

  self.register(model.id(), email, pwd, data, function (err, uID) {
    if (err && (err.message !== errors.userExists)) {
      return finalize(model, cb, err);
    }
    
    self.confirmEmail((uID.userId ? uID.userId : uID), function (err) {
      if (err && (err.message !== errors.alreadyConfirmed)) {
        return finalize(model, cb, err);
      } else {
        return finalize(model, cb, null);
      }
    });
  });
}

