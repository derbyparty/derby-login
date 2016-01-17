var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('changeEmail', function() {
  var model = null;
  var userId = null;
  var email = null;

  beforeEach(function(done) {
    model = derbyLogin.backend.createModel();
    email = util.email();
    var user = {
      email: email,
      local: {}
    }
    userId = model.add('auths', user, function() {
      model = derbyLogin.backend.createModel();
      done();
    });
  });

  it('should change email', function(done) {
    var newEmail = util.email();
    derbyLogin.changeEmail(userId, newEmail, function(err) {
      assert(!err);
      var $user = model.at('auths.' + userId);
      model.fetch($user, function() {
        assert.equal($user.get('local.emailChange.email'), newEmail);
        assert($user.get('local.emailChange.timestamp'));
        done();
      });
    });
  });

  it('should not change email when no user', function(done) {
    derbyLogin.changeEmail(model.id(), util.email(), function(err) {
      assert(err);
      done();
    });
  });

  it('should not change email when same email', function(done) {
    derbyLogin.changeEmail(userId, email, function(err) {
      assert(err);
      done();
    });
  });
});
