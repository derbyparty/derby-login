module.exports = function(req, res, done) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) return done('Missing credentials');

  done(null, email, password);
};