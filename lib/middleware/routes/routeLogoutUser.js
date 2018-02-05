module.exports = function(req, res, done) {
  var self = this,
      userId = req.body.userId;

  self.logoutUser(req, userId);
  done();
};
