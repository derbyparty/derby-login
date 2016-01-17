var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('getUserBySecret', function() {
  var userId = null;
  var secret = null;

  beforeEach(function(done) {
    var model = derbyLogin.backend.createModel();
    secret = model.id();
    var user = {
      local: {
        passwordReset: {
          secret: secret,
          timestamp: +new Date()
        }
      }
    }
    userId = model.add('auths', user, done);
  });

  it('should get user', function(done) {
    derbyLogin.getUserBySecret(secret, function(err, $user) {
      assert(!err);
      assert.equal($user.get('id'), userId);
      done();
    });
  });

  it('should not get user when wrong secret', function(done) {
    derbyLogin.getUserBySecret('wrong' + secret, function(err, $user) {
      assert(err);
      assert(!$user);
      done();
    });
  });
});
