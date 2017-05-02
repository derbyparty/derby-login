module.exports = function(req) {
  delete req.session.userIds;

  req.logout();
}
