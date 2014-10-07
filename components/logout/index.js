module.exports = Logout;
function Logout() {}
Logout.prototype = require('../base').prototype;

Logout.prototype.name = 'auth:logout';
Logout.prototype.view = __dirname;
