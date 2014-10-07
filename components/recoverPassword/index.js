module.exports = RecoverPassword;
function RecoverPassword() {}
RecoverPassword.prototype = require('../base').prototype;

RecoverPassword.prototype.name = 'auth:recoverpassword';
RecoverPassword.prototype.view = __dirname;
RecoverPassword.prototype.fields = ['email'];
