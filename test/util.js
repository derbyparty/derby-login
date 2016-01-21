var racer = require('racer');
var bcrypt = require('bcryptjs');
var derbyLogin = require('../lib');
var minFactor = 4;
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var Mingo = require('sharedb-mingo');

function gen()
{
  var text = '';
  for(var i=0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = {
  init: function(options) {``
    var backend = racer.createBackend({db:new Mingo()});
    derbyLogin.middleware(backend, options);
    return derbyLogin;
  },
  email: function() {
    return (gen() + '@' + gen() + '.ru').toLowerCase();
  },
  hash: function(password) {
    return bcrypt.hashSync(password, minFactor);
  },
  password: function() {
    return gen();
  },
  compare: bcrypt.compareSync
}
