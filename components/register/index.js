var ajax = require('../ajax');
var validation = require('../../lib/validation');

module.exports = Register;
function Register() {};
Register.prototype.name = 'auth:register';
Register.prototype.view = __dirname;

Register.prototype.create = function(model) {
  model.set('disabled', true);

  model.on('change', 'email', function() {
    model.del('errors.email');
  });
  model.on('change', 'password', function() {
    model.del('errors.password');
  });
  model.on('change', 'confirm', function() {
    model.del('errors.confirm');
  });

  model.on('all', 'errors.*', function() {
    var disabled = !model.get('email') || !model.get('password') ||
      !model.get('confirm') || validation.any(model.get('errors'));
    model.set('disabled', disabled);
  })
}

Register.prototype.blur = function(field) {
  var model = this.model;
  var error = validation.validateField(field, model.get(field));
  if (error) {
    model.set('errors.' + field, error);
  }
}

Register.prototype.submit = function() {
  var model = this.model;

  var data = {
    email: model.get('email'),
    password: model.get('password'),
    confirm: model.get('confirm')
  }
  var errors = validation.validate(data);
  if (validation.any(errors)) return model.set('errors', errors);

  ajax('/auth/register', data, model);
}
