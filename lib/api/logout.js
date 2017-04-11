module.exports = function(req) {
  delete req.session.userId;
  delete req.session.userIds;

  req.logout();
}
