module.exports = function(req, res, done) {
  var email = (req.body.email || '').toLowerCase();
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
  var userData = {};

  done(null, email, password, userData);
};
