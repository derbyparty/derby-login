var Login = require('../../Login');

Login.prototype.routeChangeEmail = require('./routeChangeEmail');
Login.prototype.routeChangePassword = require('./routeChangePassword');
Login.prototype.routeRecoverPassword = require('./routeRecoverPassword');
Login.prototype.routeResetPassword = require('./routeResetPassword');
Login.prototype.routeLogin = require('./routeLogin');
Login.prototype.routeLogout = require('./routeLogout');
Login.prototype.routeRegister = require('./routeRegister');
Login.prototype.routeRegisterAdmin = require('./routeRegisterAdmin');
Login.prototype.routeConfirmRegistration = require('./routeConfirmRegistration');
Login.prototype.routeConfirmEmailChange = require('./routeConfirmEmailChange');
Login.prototype.routeHandleStrategies = require('./routeHandleStrategies');