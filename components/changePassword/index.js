module.exports = ChangePassword;
function ChangePassword() {}
ChangePassword.prototype = require('../base').prototype;

ChangePassword.prototype.name = 'auth:changepassword';
ChangePassword.prototype.view = __dirname;
ChangePassword.prototype.fields = ['oldpassword', 'password', 'confirm'];
ChangePassword.prototype.route = 'changepassword';
