module.exports = ResetPassword;
function ResetPassword() {}
ResetPassword.prototype = require('../base').prototype;

ResetPassword.prototype.name = 'auth:resetpassword';
ResetPassword.prototype.view = __dirname;
ResetPassword.prototype.fields = ['secret', 'password', 'confirm'];
ResetPassword.prototype.route = 'resetpassword';
