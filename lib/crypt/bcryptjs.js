var bcrypt = require('bcryptjs');

module.exports = function(costFactor) {
  return {
    compare: function(password, hash, salt, done) {
      bcrypt.compare(password, hash, done);
    },
    hash: function(password, done) {
      bcrypt.hash(password, costFactor, done);
    }
  }
}
