module.exports = function($user, password, done) {
  var self = this;

  // Compare password to hash
  var hash = $user.get(self.options.localField + '.' + self.options.hashField) || '';
  var salt = $user.get(self.options.localField + '.' + self.options.saltField) || '';
  self.compare(password, hash, salt, done);
}
