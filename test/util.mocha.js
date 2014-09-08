var expect = require('expect.js');
var util = require('../lib/util');

describe('util', function() {
  var password = 'hunter1';
  var fakePassword = 'fakePassword';

  describe('hash', function() {
    it('should hash using bcrypt when bcrypt is `true`', function(done) {
      var opts = {
        bcrypt: true
      };
      util.hash(opts, password, function(err, hashedPassword, salt) {
        expect(err).equal(undefined);
        // No salt. Salt is built into bcrypt string
        expect(salt).equal(undefined);
        expect(hashedPassword).to.contain('$2a$');
        done();
      });
    });

    it('should hash using SHA-1 and return salt when bcrypt is `false`', function(done) {
      var opts = {
        bcrypt: false
      };
      util.hash(opts, password, function(err, hashedPassword, salt) {
        expect(err).equal(undefined);
        // Yes salt.
        expect(salt).to.match(/\w/);
        expect(hashedPassword).to.match(/\w/);
        done();
      });
    });
  });

  describe('compare', function() {
    it('using bcrypt should return `true` if the password matches', function(done) {
      var opts = {
        bcrypt: true
      };
      // First hash
      util.hash(opts, password, function(err, hashedPassword, salt) {
        expect(err).equal(undefined);
        // Then check
        util.compare(opts, password, hashedPassword, null, function(err, match) {
          expect(err).equal(undefined);
          expect(match).equal(true);
          done();
        });
      });
    });

    it('using bcrypt should return `false` if the password doesnt matches', function(done) {
      var opts = {
        bcrypt: true
      };
      // First hash
      util.hash(opts, password, function(err, hashedPassword, salt) {
        expect(err).equal(undefined);
        // Then check
        util.compare(opts, fakePassword, hashedPassword, null, function(err, match) {
          expect(err).equal(undefined);
          expect(match).equal(false);
          done();
        });
      });
    });

    it('using SHA-1 should return `true` if the password matches', function(done) {
      var opts = {
        bcrypt: false
      };
      // First hash
      util.hash(opts, password, function(err, hashedPassword, salt) {
        expect(err).equal(undefined);
        // Then check
        util.compare(opts, password, hashedPassword, salt, function(err, match) {
          expect(err).equal(undefined);
          expect(match).equal(true);
          done();
        });
      });
    });

    it('using SHA-1 should return `false` if the password dosent match', function(done) {
      var opts = {
        bcrypt: false
      };
      // First hash
      util.hash(opts, password, function(err, hashedPassword, salt) {
        expect(err).equal(undefined);
        // Then check
        util.compare(opts, fakePassword, hashedPassword, salt, function(err, match) {
          expect(err).equal(undefined);
          expect(match).equal(false);
          done();
        });
      });
    });
  });

});

