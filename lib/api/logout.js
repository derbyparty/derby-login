module.exports = function(req) {
  delete req.session.userId;
  req.session.userIds = [];
  req.logout();
}
