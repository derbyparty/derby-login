module.exports = function(req) {
  delete req.session.userId;

  req.logout();
}
