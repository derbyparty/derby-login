var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('register', function() {
  var model = null;
  var email = null;
  var password = null;
  var userData = null;

  beforeEach(function(done) {
    model = derbyLogin.store.createModel();
    email = util.email();
    password = util.password();
    userData = {
      a: 'b'
    }
    done();
  });

  it('should register', function(done) {
    derbyLogin.register(email, password, userData, function(err, userId) {
      assert(!err);
      var $user = model.at('auths.' + userId);
      model.fetch($user, function() {
        assert.equal($user.get('local.emailChange.email'), email);
        assert($user.get('local.emailChange.timestamp'));
        assert(util.compare(password, $user.get('local.hash')));
        assert.equal($user.get('a'), 'b');
        done();
      });
    });
  });

  it('should not register when user with email exist', function(done) {
    model.add('auths', {email: email}, function() {
      derbyLogin.register(email, password, userData, function(err) {
        assert(err);
        done();
      });
    });
  });
});
