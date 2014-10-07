var assert = require('assert');
var util = require('./util');

describe('crypt', function() {
  var password = null;

  beforeEach(function(done) {
    password = util.password();
    done();
  });

  it('bcrypt', function(done) {
    var derbyLogin = util.init({encryption: 'bcrypt'});
    derbyLogin.hash(password, function(err, hash) {
      assert(!err);
      assert(hash);
      derbyLogin.compare(password, hash, null, function(err, matches) {
        assert(!err);
        assert(matches);
        derbyLogin.compare('wrong' + password, hash, null, function(err, matches) {
          assert(!err);
          assert(!matches);
          done();
        });
      });
    });
  });

  it('bcryptjs', function(done) {
    var derbyLogin = util.init({encryption: 'bcryptjs'});
    derbyLogin.hash(password, function(err, hash) {
      assert(!err);
      assert(hash);
      derbyLogin.compare(password, hash, null, function(err, matches) {
        assert(!err);
        assert(matches);
        derbyLogin.compare('wrong' + password, hash, null, function(err, matches) {
          assert(!err);
          assert(!matches);
          done();
        });
      });
    });
  });

  it('sha-1', function(done) {
    var derbyLogin = util.init({encryption: 'sha-1'});
    derbyLogin.hash(password, function(err, hash, salt) {
      assert(!err);
      assert(hash);
      derbyLogin.compare(password, hash, salt, function(err, matches) {
        assert(!err);
        assert(matches);
        derbyLogin.compare('wrong' + password, hash, salt, function(err, matches) {
          assert(!err);
          assert(!matches);
          done();
        });
      });
    });
  });
});
