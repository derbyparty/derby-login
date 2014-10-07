var crypto = require('crypto');

module.exports = function(saltLength) {
  function sha1Salt() {
    return crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').substring(0, saltLength);
  }

  function sha1Hash(salt, password) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
  }

  return {
    compare: function(password, hash, salt, done) {
      var passwordHash = sha1Hash(salt, password);
      var matches = hash === passwordHash;
      done(null, matches);
    },
    hash: function(password, done) {
      var salt = sha1Salt();
      var passwordHash = sha1Hash(salt, password);
      done(null, passwordHash, salt);
    }
  }
}
