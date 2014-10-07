require('./passport');
require('./middleware');
require('./api');
require('./crypt');

var Login = require('./Login');

module.exports = new Login();
