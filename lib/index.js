var extend = require('extend');
var passport = require('passport');
var auth = require('./auth');
var middleware = require('./middleware');
var routes = require('./routes');
var strategies = require('./strategies');

var options = null;

module.exports = {
  middleware: function(opts) {
    // Merge options
    var defaultOptions = {
      collection: 'auths',
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
    
    options = extend(true, opts, defaultOptions);

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

    return middleware(options);
  },
  routes: function(expressApp, store) {
    // Init routes
    routes(expressApp, options);

    // Projection
    store.shareClient.backend.addProjection(options.publicCollection, options.collection, 'json0', options.user);
  }
}