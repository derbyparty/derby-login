module.exports = function(req) {
  req.session.userIds = [];
  req.logout();
}
