module.exports = function(userId, req, done) {
  req.session.userId = userId;

  req.login(userId, done);
}
