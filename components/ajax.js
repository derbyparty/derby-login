var superagent = require('superagent');

module.exports = function(url, data, cb){
  cb = cb || function(){};
  superagent
    .post(url)
    .send(data)
    .set('X-Requested-With', 'XMLHttpRequest')
    .end(cb);
}