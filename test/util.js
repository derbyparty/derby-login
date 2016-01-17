var racer = require('racer');
var bcrypt = require('bcryptjs');
var derbyLogin = require('../lib');
var minFactor = 4;
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function gen()
{
  var text = '';
  for(var i=0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = {
  init: function(options) {
    var store = racer.createBackend();
    derbyLogin.middleware(store, options);
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
