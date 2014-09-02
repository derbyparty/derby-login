var ajax = require('../ajax');
var validation = require('../../lib/validation');

module.exports = ResetPassword;
function ResetPassword() {};
ResetPassword.prototype.name = 'auth:reset';
ResetPassword.prototype.view = __dirname;

ResetPassword.prototype.create = function(model) {
  model.set('disabled', true);

  model.on('change', 'password', function() {
    model.del('errors.password');
  });
  model.on('change', 'confirm', function() {
    model.del('errors.confirm');
  });

  model.on('all', 'errors.*', function() {
    var disabled = !model.get('password') || !model.get('confirm') || validation.any(model.get('errors'));
    model.set('disabled', disabled);
  })
}

ResetPassword.prototype.blur = function(field) {
  var model = this.model;
  var error = validation.validateField(field, model.get(field));
  if (error) {
    model.set('errors.' + field, error);
  }
}

ResetPassword.prototype.submit = function() {
  var model = this.model;

  var data = {
    password: model.get('password'),
    confirm: model.get('confirm'),
    resetId: model.get('resetId')
  }
  var errors = validation.validate(data);
  if (validation.any(errors)) return model.set('errors', errors);

  ajax('/auth/reset', data, model, function() {
    model.set('success', true);
  });
}
