module.exports = function(req, res, done) {
  var email = req.body.email;

  if (!email) return done('Missing email');
  if (!this.options.emailRegex.test(email)) return done('Incorrect email');

  done(null, email);
};