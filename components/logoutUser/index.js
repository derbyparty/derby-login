module.exports = LogoutUser;
function LogoutUser() {}
LogoutUser.prototype = require('../base').prototype;

LogoutUser.prototype.name = 'auth:logoutuser';
LogoutUser.prototype.view = __dirname;
LogoutUser.prototype.fields = ['userId'];
LogoutUser.prototype.route = 'logoutuser';
