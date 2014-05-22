var ajax = require('../ajax');
var validation = require('../../lib/validation');

module.exports = ChangePassword;
function ChangePassword() {};
ChangePassword.prototype.view = __dirname;

ChangePassword.prototype.create = function(model) {
  model.set('disabled', true);

  model.on('change', 'oldpassword', function() {
    model.del('errors.oldpassword');
  });
  model.on('change', 'password', function() {
    model.del('errors.password');
  });
  model.on('change', 'confirm', function() {
    model.del('errors.confirm');
  });

  model.on('all', 'errors.*', function() {
    var disabled = !model.get('oldpassword') || !model.get('password') ||
      !model.get('confirm') || validation.any(model.get('errors'));
    model.set('disabled', disabled);
  })
}

ChangePassword.prototype.blur = function(field) {
  var model = this.model;
  var error = validation.validateField(field, model.get(field));
  if (error) {
    model.set('errors.' + field, error);
  }
}

ChangePassword.prototype.submit = function() {
  var model = this.model;

  var data = {
    oldpassword: model.get('oldpassword'),
    password: model.get('password'),
    confirm: model.get('confirm')
  }
  var errors = validation.validate(data);
  if (validation.any(errors)) return model.set('errors', errors);

  ajax('/auth/changepassword', data, model);
}