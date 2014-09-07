var bcrypt = require('bcrypt');

var COST_FACTOR = 10;

module.exports = {
  hash: hash,
  compare: compare,
}

function hash(password, done) {
  return bcrypt.hash(password, COST_FACTOR, done);
}

function compare(password, hash, done) {
  return bcrypt.compare(password, hash, done);
}
