module.exports = function(userId, req, done) {
  req.login(userId, done);
}
