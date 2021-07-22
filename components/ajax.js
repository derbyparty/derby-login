var superagent = require('superagent');

module.exports = function(url, query, data, cb){
  cb = cb || function(){};
  superagent
    .post(url)
    .query(query)
    .send(data)
    .set('X-Requested-With', 'XMLHttpRequest')
    .end(cb);
}
