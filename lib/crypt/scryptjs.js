var crypto = require('crypto'),
    scrypt = require('scryptsy');

module.exports = function(saltLength) {
  var N         = 16384,
      r         = 8,
      p         = 1,
      lenBytes  = 64;
  
  function scryptSalt() {
    return crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').substring(0, saltLength);
  }

  return {
    compare: function(password, hash, salt, done) {
      var p   = scrypt(password, salt, N, r, p, lenBytes),
          eq  = (p.toString('hex') === hash);
      
      done(null, eq);
    },
    hash: function(password, done) {
      var salt  = scryptSalt(),
          h     = scrypt(password, salt, N, r, p, lenBytes);
      
      done(null, h.toString('hex'), salt);
    }
  }
}
