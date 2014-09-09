var bcrypt = require('bcrypt');
var crypto = require('crypto');

var COST_FACTOR = 10;
var SALT_LENGTH = 10;

module.exports = {
  hash: hash,
  compare: compare,
};

function sha1Salt() {
  return crypto.randomBytes(Math.ceil(SALT_LENGTH / 2)).toString('hex').substring(0, SALT_LENGTH);
}
  
function sha1Hash(salt, password) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

/**
 * Password Hashing function. Using SHA-1 or bcrypt
 * @param  {Object}   opts     Object 
 *                             E.g.
 *                             {
 *                                encrypt: 'sha-1' 
 *                             }                           
 * @param  {String}   password The plain text password 
 * @param  {Function} done     Function(err, salt) {}
 *                              - err {Error} 
 *                              - salt {String} the salt used
 * @return {null}
 */
function hash(opts, password, done) {
  if (opts.encrypt === 'bcrypt') {
    bcrypt.hash(password, COST_FACTOR, done);
  } else {
    var salt = sha1Salt();
    var passwordHash = sha1Hash(salt, password);
    done(undefined, passwordHash, salt);
  }
}
/**
 * Password Comparing function. Compares using SHA-1 or bcrypt
 * @param  {Object}   opts     Object 
 *                             E.g.
 *                             {
 *                                encrypt: 'sha-1' 
 *                             }                           
 * @param  {String}   password The plain text password 
 * @param  {String}   hash     The hashes password to compare
 * @param  {String}   salt     Optional used for SHA-1
 * @param  {Function} done     Function(err, salt) {}
 *                              - err {Error} 
 *                              - match {Boolean} `true` if the password match, otherwise `false`
 * @return {null}
 */
function compare(opts, password, hash, salt, done) {
  if (opts.encrypt === 'bcrypt') {
    return bcrypt.compare(password, hash, done);
  } else {
    var p = sha1Hash(salt, password);
    var matches = hash === p;
    done(undefined, matches);
  }
}
