var superagent = require('superagent');

module.exports = function(url, data, model) {
  superagent
    .post(url)
    .send(data)
    .end(function(res) {
      if (res.ok) {
        if (res.body.success) window.location = '/';
        else model.set('errors', res.body)
      } else {
        model.set('errors.error', res.text);
      }
    });
}