var Login = require('../Login');

Login.prototype.authenticate = require('./authenticate');
Login.prototype.changeEmail = require('./changeEmail');
Login.prototype.changePassword = require('./changePassword');
Login.prototype.confirmEmail = require('./confirmEmail');
Login.prototype.getUserByEmail = require('./getUserByEmail');
Login.prototype.getUserBySecret = require('./getUserBySecret');
Login.prototype.login = require('./login');
Login.prototype.logout = require('./logout');
Login.prototype.passwordMatch = require('./passwordMatch');
Login.prototype.register = require('./register');
Login.prototype.registerProvider = require('./registerProvider');
Login.prototype.resetPassword = require('./resetPassword');
Login.prototype.resetPasswordSecret = require('./resetPasswordSecret');
Login.prototype.setPassword = require('./setPassword');
Login.prototype.userExists = require('./userExists');
Login.prototype.createUser = require('./createUser');
