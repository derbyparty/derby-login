module.exports = {
  // Data
  collection: 'auths',
  publicCollection: 'users',
  user: {
    id: true,
    email: true
  },

  // Local provider
  encryption: 'bcryptjs', // 'bcryptjs' (js) or 'bcrypt' (native) or 'sha-1'
  encryptionStrength: 10,
  localField: 'local',
  emailField: 'email',
  hashField: 'hash',
  saltField: 'salt',
  confirmEmailTimeLimit: '3d', // ms formats possible: 0.5y, 1d, 10h, etc
  resetPasswordTimeLimit: '3d', // 3 days
  confirmRegistration: true, // should we send email to confirm address or login user immediately

  // Passport
  passport: {
    userProperty: 'userId'
  },
  strategies: {},

  // Some values to use in hooks
  confirmEmailChangeUrl: '/confirmemailchange',
  confirmRegistrationUrl: '/confirmregistration',
  emailChangeConfirmedUrl: '/emailchangeconfirmed',
  loginUrl: '/login',
  recoverPasswordUrl: '/recoverpassword',
  registrationConfirmedUrl: '/registrationconfirmed',
  successUrl: '/',

  emailRegex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  // Hooks
  hooks: {
    // Next hooks are for parsing values from requests for different operations
    // Parsing requests manually makes possible creating forms with different fields
    // It's good place for validation
    parseChangeEmailRequest: function(req, res, done) {
      var email = req.body.email;

      if (!email) return done('Missing email');
      if (!this.options.emailRegex.test(email)) return done('Incorrect email');

      done(null, email);
    },

    parseChangePasswordRequest: function(req, res, done) {
      var oldpassword = req.body.oldpassword;
      var password = req.body.password;
      var confirm = req.body.confirm;

      if (!oldpassword || !password || !confirm) return done('Please fill all fields');
      if (password !== confirm) return done('Password should match confirmation');

      done(null, oldpassword, password);
    },

    parseConfirmEmailRequest: function(req, res, done) {
      var userId = req.query.id;

      if (!userId) return done('Missing id');

      done(null, userId);
    },

    parseLoginRequest: function(req, res, done) {
      var email = req.body.email;
      var password = req.body.password;

      if (!email || !password) return done('Missing credentials');

      done(null, email, password);
    },

    parseRegisterRequest: function(req, res, done) {
      var email = req.body.email;
      var password = req.body.password;
      var confirm = req.body.confirm;

      if (!email || !password || !confirm) return done('Please fill all fields');
      if (password !== confirm) return done('Password should match confirmation');
      // There is no good way to test emails by regex. The only good way is to send confirmation letter
      // This regex should pass all correct emails, but can pass some incorrect emails also
      if (!this.options.emailRegex.test(email)) return done('Incorrect email');
      if (password.length < 6) return done('Password length should be at least 6');

      // You can pass custom values to new user with help of userData parameter
      // For example we can pass userId from session
      var userData = {
        id: req.session.userId
      };
      done(null, email, password, userData);
    },

    parseRecoverPasswordRequest: function(req, res, done) {
      var email = req.body.email;

      if (!email) return done('Missing email');

      done(null, email);
    },

    parseResetPasswordRequest: function(req, res, done) {
      var secret = req.body.secret;
      var password = req.body.password;
      var confirm = req.body.confirm;

      if (!secret) return done('Secret is missing');
      if (!password || !confirm) return done('Please fill all fields');
      if (password !== confirm) return done('Password should match confirmation');

      done(null, secret, password);
    },

    // Email hooks
    sendChangeEmailConfirmation: function(userId, email, done) {
      // Place to send a letter that confirms email address on change
      // Email should have a link pointing to /auth/confirmemailchange?id=<userId>
      done();
    },

    sendRegistrationConfirmation: function(userId, email, done) {
      // Place to send a letter that confirms email address on registration
      // Email should have a link pointing to /auth/confirmregistration?id=<userId>
      done();
    },

    sendRecoveryConfirmation: function(userId, email, secret, done) {
      // Place to send a letter with revovery link to your page with
      // resetpassword component
      // Include secret in url, ex: /<recoverPasswordUrl>?secret=<secret>
      // Create route, where you parse secret and render page with resetpassword component
      // Put secret in model, ex: model.set('_page.secret', secret);
      // And pass it to resetpassword component, ex:
      // <view name='auth:resetpassword' secret='{{_page.secret}}' />
      done();
    },

    // Request hook executes on every request before it goes to app, it's good place
    // to restrict access to some urls
    request: function(req, res, userId, isAuthenticated, done) {
      // Redirect all unAuth GET requests to loginUrl
      if (!isAuthenticated && req.method === 'GET' &&
        req.url !== this.options.confirmRegistrationUrl &&
        req.url !== this.options.loginUrl &&
        req.url !== this.options.registrationConfirmedUrl &&
        req.url.indexOf(this.options.recoverPasswordUrl) !== 0 &&
        req.url.indexOf('/auth/') !== 0) {
        return res.redirect(this.options.loginUrl);
      }
      done();
    },

    // Response hook
    response: function(err, methodOrProvider, req, res) {
      // Some operation just finished and we should send response
      // It can differ based on arguments:
      // err - if it's absent, operation was successful, otherwise it failed
      // methodOrProvider - it shows type of operation: 'login', 'logout',
      // 'changepassword', 'recoverpassword', 'resetpassword', 'register',
      // or provider's name for OAuth operations: 'google', 'github', etc
      // req.xhr - shows if request was XmlHttpRequest or not

      // Parse error message
      if (err && err.toString) {
        err = err.toString();
      }

      // Built-in components send xhr requests and wait
      // for {error: errorMessage} JSON in case of error
      // and {success: true, url: redirectUrl} JSON in case of success
      if (req.xhr) {
        if (err) return res.json({error: err});

        switch (methodOrProvider) {
          case 'register':
            var url = this.options.confirmRegistrationUrl;
            if (!this.options.confirmRegistration) url = this.options.successUrl;
            return res.json({success: true, url: url});
          // do not send redirect url, to emit component success event
          case 'changeemail':
            return res.json({success: true});
          case 'changepassword':
            return res.json({success: true});
          case 'recoverpassword':
            return res.json({success: true});
          case 'resetpassword':
            return res.json({success: true});
          default:
            return res.json({success: true, url: this.options.successUrl});
        }
      }

      if (methodOrProvider === 'confirmemailchange') {
        if (err) return res.send(err);
        return res.redirect(this.options.emailChangeConfirmedUrl);
      }

      if (methodOrProvider === 'confirmregistration') {
        if (err) return res.send(err);
        return res.redirect(this.options.registrationConfirmedUrl);
      }

      // Redirect in case if it's not xhr request
      res.redirect(err ? req.get('Referrer') : this.options.successUrl);
    },

    // Errors
    error: function(key) {
      // User errors by key for localization support, though I'm still not sure
      // how to get user's session here to know the language
      var errors = {
        alreadyConfirmed: 'Already confirmed',
        confirmationExpired: 'Confirmation is expired',
        equalEmails: 'Old and new emails are equal',
        noLocal: 'User is not registered with email/password',
        noUser: 'User is not registered',
        noUserByEmail: 'No user with this email',
        noUserBySecret: 'Wrong secret. Maybe your reset password link is out of date',
        providerExists: 'User is already registered with this provider',
        resetPasswordExpired: 'Reset password is expired',
        userExists: 'User already exists',
        wrongOldPassword: 'Old password is wrong',
        wrongPassword: 'Password is wrong'
      };
      var message = errors[key] || 'Unknown Error';
      return new Error(message);
    }
  }
};
