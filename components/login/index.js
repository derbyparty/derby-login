var ajax = require('../ajax');
var validation = require('../../lib/validation');

module.exports = Login;
function Login() {}
Login.prototype.name = 'auth:login';
Login.prototype.view = __dirname;

Login.prototype.create = function(model) {
  model.set('disabled', true);

  model.on('change', 'email', function() {
    model.del('errors.email');
  });
  model.on('change', 'password', function() {
    model.del('errors.password');
  });

  model.on('all', 'errors.*', function() {
    var disabled = !model.get('email') || !model.get('password') ||
      validation.any(model.get('errors'));
    model.set('disabled', disabled);
  })
}

Login.prototype.submit = function() {
  var model = this.model;

  var data = {
    email: model.get('email'),
    password: model.get('password')
  }

  ajax('/auth/login', data, model);
}