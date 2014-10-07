var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('getUserByEmail', function() {
  var userId = null;
  var email = null;

  beforeEach(function(done) {
    var model = derbyLogin.store.createModel();
    email = util.email();
    var user = {
      email: email
    }
    userId = model.add('auths', user, done);
  });

  it('should get user', function(done) {
    derbyLogin.getUserByEmail(email, function(err, $user) {
      assert(!err);
      assert.equal($user.get('id'), userId);
      done();
    });
  });

  it('should not get user when wrong email', function(done) {
    derbyLogin.getUserByEmail('wrong' + email, function(err, $user) {
      assert(err);
      assert(!$user);
      done();
    });
  });
});
