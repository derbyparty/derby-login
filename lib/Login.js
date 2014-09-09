var debug = require('debug')('auth');
var extend = require('extend');
var passport = require('passport');
var auth = require('./auth');
var routes = require('./routes');
var session = require('./session');
var strategies = require('./strategies');
var validation = require('./validation');

function Login() {}

Login.prototype.middleware = function(store, options) {

  // Merge options
  var defaultOptions = {
    collection: 'auths',
    encrypt: 'sha-1', // or 'bcrypt'
    publicCollection: 'users',
    // localFirst: false,
    passport: {
      successRedirect: '/',
      failureRedirect: '/login'
    },
    strategies: {},
    user: {
      id: true,
      timestamps: true
    }
  };
  
  options = extend(true, defaultOptions, options);

  // Init of Passport
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

  // Init of other modules and return middleware
  auth.init(options);

  strategies(options);

  // Projection
  store.shareClient.backend.addProjection(options.publicCollection, options.collection, 'json0', options.user);

  var routesMiddleware = routes(options);
  var sessionMiddleware = session(options);

  return function (req, res, next) {
    passport.initialize()(req, res, function() {
      passport.session()(req, res, function() {
        sessionMiddleware(req, res, function() {
          routesMiddleware(req, res, next);
        });
      });
    });
  };
};

module.exports = Login;
