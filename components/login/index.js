module.exports = Login;
function Login() {}
Login.prototype = require('../base').prototype;

Login.prototype.name = 'auth:login';
Login.prototype.view = __dirname;
Login.prototype.fields = ['email', 'password'];
Login.prototype.route = 'login';
