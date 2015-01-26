var Login = require('../Login');
var cryptModule = null;

Login.prototype.initCrypt = function() {
  switch (this.options.encryption) {
    case 'bcrypt':
      cryptModule = require('./bcrypt')(this.options.encryptionStrength);
      break;
    case 'bcryptjs':
      cryptModule = require('./bcryptjs')(this.options.encryptionStrength);
      break;
    case 'scrypt':
      cryptModule = require('./scrypt')();
      break;
    case 'scryptjs':
      cryptModule = require('./scryptjs')(this.options.encryptionStrength);
      break;
    case 'sha-1':
    case 'sha1':
      cryptModule = require('./sha1')(this.options.encryptionStrength);
      break;
    default:
      throw new Error('Unknown encryption: ' + this.options.encryption);
  }
}


Login.prototype.hash = function(password, done) {
  cryptModule.hash(password, done);
}

Login.prototype.compare = function(password, hash, salt, done) {
  cryptModule.compare(password, hash, salt, done);
}
