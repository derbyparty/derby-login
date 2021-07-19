module.exports = function(req, res, done) {
  var self = this;

  self.parseChangePasswordRequest(req, res, function(err, oldpassword, password) {
    if (err) return done(err);

    var userId = req.model.get('_session.userId');

    self.changePassword(userId, oldpassword, password, function(err){
      if (err) return done(err);

      self.sendChangePassword(userId, password, done);
    });
  });
};
