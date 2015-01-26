module.exports = function(req, res, done) {
  var self = this;

  self.parseChangePasswordRequest(req, res, function(err, oldpassword, password) {
    if (err) return done(err);

    self.changePassword(req.session.userId, oldpassword, password, done);
  });
};