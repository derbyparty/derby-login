module.exports = function(req, res, done) {
  var self = this;

  self.parseConfirmEmailRequest(req, res, function(err, userId) {
    if (err) return done(err);

    self.sendRegistrationConfirmationComplete(userId, function(err){
      if (err) return done(err);

      self.confirmEmail(userId, function(err) {
        if (err) return done(err);

        self.login(userId, req, done);
      });

    })

  });
};