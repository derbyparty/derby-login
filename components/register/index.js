module.exports = Register;
function Register() {}
Register.prototype = require('../base').prototype;

Register.prototype.name = 'auth:register';
Register.prototype.view = __dirname;
Register.prototype.fields = ['email', 'password', 'confirm'];
Register.prototype.route = 'register';
