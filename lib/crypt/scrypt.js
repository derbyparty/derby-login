var scrypt = require('scrypt');

module.exports = function() {
  return {
    compare: function(password, hash, salt, done) {
      scrypt.verify(hash, password, done);
    },
    hash: function(password, done) {
      scrypt.hash.config.keyEncoding = 'utf8';
      scrypt.hash(password, { N: 16384, r: 8, p: 1 }, done);
    }
  }
}
