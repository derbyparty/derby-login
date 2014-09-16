var passport = require('passport');
var util = require('./util');

var options = null;

module.exports = {
  init: init,
  changePassword: changePassword,
  login: login,
  register: register,
  registerProvider: registerProvider
};

function init(opts) {
  options = opts;
}

function changePassword(oldpassword, password, userId, model, done) {
  var $user = model.at(options.collection + '.' + userId);
  model.fetch($user, function(err) {
    if (err) return done(err);

    var user = $user.get();
    if (!user) {
      return done('You are not registered');
    }

    if (!user.local) {
      return done('You are not registered with password');
    }

    // Check the old password
    util.compare(options, oldpassword, user.local.passwordHash, user.local.salt, function(err, match) {
      if (err) return done(err);

      if (!match) {
        return done({ oldpassword: 'Incorrect Old Password' });
      }

      // Set the new password hash
      util.hash(options, password, function(err, passwordHash, salt) {
        if (err) return done(err);

        // Set the new passwordHash
        $user.set('local.passwordHash', passwordHash, function(err) {
          if (err) return done(err);

          // If we don't have a salt (E.g. using bcrypt) we're done
          if (!salt) {
            return done();
          }
          // Otherwise, set the new salt
          $user.set('local.salt', salt, function(err) {
            if (err) return done(err);

            return done();
          });
        });
      });
    });
  });
}

function login(user, req, done) {
  req.session.userId = user.id;
  if (req.isAuthenticated()) {
    done(null, user);
  } else {
    req.login(user, function(err) {
      if (err) return done(err);

      done(null, user);
    });
  }
}

function registerProvider($user, provider, profile, req, res, done) {
  var callback = function() {
    if (options.passport.registerCallback) {
      options.passport.registerCallback(req, res, $user.get(), function() {
        login($user.get(), req, done);
      });
    } else {
      login($user.get(), req, done);
    }
  };
  var user = $user.get();

  if (user) {
    options.registerCallback(req, user, profile, function(err, user) {
      if (err || !user) return done(err, user);
      
      $user.set(provider, profile, function(err) {
        if (err) return done(err);
        $user.set('timestamps.registered', +new Date(), callback);
      });
    });
  /*} if (options.localFirst && provider !== 'local') {
    done(null, null, {});*/
  } else {
    var model = req.getModel();
    user = {
      id: model.id(),
      timestamps: {
        registered: +new Date()
      }
    };
    user[provider] = profile;
    
    options.registerCallback(req, user, profile, function(err, user) {
      if (err || !user) return done(err, user);
      
      model.add(options.collection, user, function(err) {
        if (err) return done(err);
  
        $user = model.at(options.collection + '.' + user.id);
        // Legacy registerCallback
        callback();
      });
    });
  }
}

function register(email, password, userId, model, req, res, done) {
  email = email.toLowerCase();

  var query = { $limit: 1 };
  query['local.email'] = email;
  var $userQuery = model.query(options.collection, query);

  var $user = model.at(options.collection + '.' + userId);

  model.fetch($userQuery, $user, function(err) {
    if (err) return done(err);

    var user = $userQuery.get()[0];
    if (user) {
      return done({ email: 'User with this email already exists' });
    }

    if ($user.get('local')) {
      return done({ email: 'You are already registered' });
    }

    // Hash the password
    util.hash(options, password, function(err, passwordHash, salt) {
      if (err) return done(err);

      // Create local profile
      var profile = {
        email: email,
        passwordHash: passwordHash
      };

      // Add the salt to the profile if we have one.
      if (salt) {
        profile.salt = salt;
      }
      // Save user with profile
      registerProvider($user, 'local', profile, req, res, done);
    });
  });
}
