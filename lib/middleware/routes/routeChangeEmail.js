module.exports = function(req, req, done) {
  var self = this;

  self.parseChangeEmailRequest(req, res, function(err, email) {
    if (err) return done(err);

    self.changeEmail(req.session.userId, email, function(err) {
      if (err) return done(err);

      if (self.options.confirmRegistration) {
        self.sendChangeEmailConfirmation(req.session.userId, email, done);
      } else {
        done();
      }
    });
  });
};