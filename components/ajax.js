var superagent = require('superagent');

module.exports = function(url, data, model, cb) {
  superagent
    .post(url)
    .send(data)
    .end(function(res) {
      if (res.ok) {
        if (res.body.success && res.body.url) {
          window.location = res.body.url;
        } else if (res.body.success) {
          cb(res.body);
        } else {
          model.set('errors', res.body);
        }
      } else {
        model.set('errors.error', res.text);
      }
    });
}
