module.exports = function(req, userId) {
  var self = this,
      _userIndex,
      userIds = req.session.userIds;

  _userIndex = userIds.indexOf(userId);

  if (userIds.length === 1) {
    self.logout(req);
  } else {
    if (req._passport && req._passport.session && _userIndex != -1) {
      userIds.splice(_userIndex, 1);
      req._passport.session.user = req.session.userIds = userIds;
      delete req.session.userId;
    }
  }
}
