var assert = require('assert');
var util = require('../util');
var derbyLogin = util.init();

describe('changePassword', function() {
  var model = null;
  var userId = null;
  var password = null;

  beforeEach(function(done) {
    model = derbyLogin.store.createModel();
    password = util.password();
    var user = {
      local: {
        hash: util.hash(password)
      }
    }
    userId = model.add('auths', user, function() {
      model = derbyLogin.store.createModel();
      done();
    });
  });

  it('should change password', function(done) {
    var newPassword = util.password();
    derbyLogin.changePassword(userId, password, newPassword, function(err) {
      assert(!err);
      var $user = model.at('auths.' + userId);
      model.fetch($user, function() {
        var hash = $user.get('local.hash');
        assert(util.compare(newPassword, hash));
        done();
      });
    });
  });

  it('should not change password when no user', function(done) {
    derbyLogin.changePassword(model.id(), password, util.password(), function(err) {
      assert(err);
      done();
    });
  });

  it('should not change email when wrong old password', function(done) {
    derbyLogin.changePassword(userId, 'wrong' + password, util.password(), function(err) {
      assert(err);
      done();
    });
  });
});
