var ajax = require('../ajax');

module.exports = Base;

function Base() {}

Base.prototype.create = function(model) {
  if (this.fields) {
    var cleanError = function() {
      model.del('error');
    }
    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      model.on('change', field, cleanError);
    }
  }
}

Base.prototype.submit = function() {
  if (this.fields) {
    var data = {};
    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      data[field] = (this[field + 'Input'] ? this[field + 'Input'].value : this.model.get(field));
    }
    this.send(data);
  } else {
    this.send();
  }
}

Base.prototype.send = function(data) {
  var model = this.model;
  var self = this;

  function error(message) {
    model.set('error', message);
    self.emit('error', message);
  }

  model.set('sending', true);

  ajax('/auth/' + this.name.substr(5), data, function(res) {
    model.del('sending');
    if (!res.ok) return error(res.text);

    if (res.body.success) {
      var redirectUrl = res.body.url;
      if (redirectUrl) {
        window.location = redirectUrl;
      } else {
        if (self.fields) {
          for (var i = 0; i < self.fields.length; i++) {
            var field = self.fields[i];
            model.del(field);
          }
        }
        self.emit('success', data);
      }
    } else {
      error(res.body.error);
    }
  });
}
