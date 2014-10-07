module.exports = ChangeEmail;
function ChangeEmail() {}
ChangeEmail.prototype = require('../base').prototype;

ChangeEmail.prototype.name = 'auth:changeemail';
ChangeEmail.prototype.view = __dirname;
ChangeEmail.prototype.fields = ['email'];
