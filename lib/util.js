var crypto = require('crypto');

var saltLength = 10;

module.exports = {
  encryptPassword: encryptPassword,
  makeSalt: makeSalt
}

function encryptPassword(password, salt) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

function makeSalt() {
  return crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').substring(0, saltLength);
}