module.exports = function(req, res, done) {
  var self = this;

  self.logout(req);
  done();
};
