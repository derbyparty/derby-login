module.exports = function(req, res, done) {
  var self = this;

  self.parseChangeEmailRequest(req, res, function(err, email) {
    if (err) return done(err);

    var userId = req.model.get('_session.userId');

    self.changeEmail(userId, email, function(err) {
      if (err) return done(err);

      if (self.options.confirmRegistration) {
        self.sendChangeEmailConfirmation(userId, email, done);
      } else {
        done();
      }
    });
  });
};
