module.exports = function(req, res, done) {
  var secret = req.body.secret;
  var password = req.body.password;
  var confirm = req.body.confirm;

  if (!secret) return done('Secret is missing');
  if (!password || !confirm) return done('Please fill all fields');
  if (password !== confirm) return done('Password should match confirmation');

  done(null, secret, password);
};