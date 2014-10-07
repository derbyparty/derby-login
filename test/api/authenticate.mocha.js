var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('authenticate', function() {
  var userId = null;
  var email = null;
  var password = null;

  beforeEach(function(done) {
    var model = derbyLogin.store.createModel();
    email = util.email();
    password = util.password();
    var user = {
      email: email,
      local: {
        hash: util.hash(password)
      }
    }
    userId = model.add('auths', user, done);
  });

  it('should authenticate', function(done) {
    derbyLogin.authenticate(email, password, function(err, id) {
      assert(!err);
      assert.equal(id, userId);
      done();
    });
  });

  it('should not authenticate with wrong email', function(done) {
    derbyLogin.authenticate('wrong' + email, password, function(err, id) {
      assert(err);
      assert(!id);
      done();
    });
  });

  it('should not authenticate with wrong password', function(done) {
    derbyLogin.authenticate(email, 'wrong' + password, function(err, id) {
      assert(err);
      assert(!id);
      done();
    });
  });
});
