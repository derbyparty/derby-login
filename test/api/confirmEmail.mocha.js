var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('confirmEmail', function() {
  var model = null;
  var userId = null;
  var email = null;

  beforeEach(function(done) {
    model = derbyLogin.backend.createModel();
    email = util.email();
    var user = {
      local: {
        emailChange: {
          email: email,
          timestamp: +new Date()
        }
      }
    }
    userId = model.add('auths', user, function() {
      model = derbyLogin.backend.createModel();
      done();
    });
  });

  it('should confirm email', function(done) {
    derbyLogin.confirmEmail(userId, function(err) {
      assert(!err);
      var $user = model.at('auths.' + userId);
      model.fetch($user, function() {
        assert.equal($user.get('email'), email);
        assert(!$user.get('local.emailChange'));
        done();
      });
    });
  });

  it('should not confirm email when no user', function(done) {
    derbyLogin.confirmEmail(model.id(), function(err) {
      assert(err);
      done();
    });
  });
});
