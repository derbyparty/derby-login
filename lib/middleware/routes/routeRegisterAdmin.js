module.exports = function(req, res, done) {
  var self = this;

  self.parseRegisterRequest(req, res, function(err, email, password, userData) {
    if (err) return done(err);

    // Register new id for new user, instead of using session.userId
    var model = req.getModel();
    var newUserId = model.id();

    self.register(newUserId, email, password, userData, function(err, newUserId) {
      if (err) return done(err);

      if (self.options.confirmRegistration) {
        self.sendRegistrationConfirmation(newUserId, email, password, userData, function(err){
          if (err) return done(err);
          done(null, {userId: newUserId});
        });
      } else {
        self.sendRegistrationInfo(newUserId, email, password, userData, function(err){
          if (err) return done(err);

          self.confirmEmail(newUserId, function(err) {
            if (err) return done(err);
            // We don't login here, but trigger done here regardless
            done(null, {userId: newUserId});
          });
        });
      }
    });
  });
};