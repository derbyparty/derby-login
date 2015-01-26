module.exports = function(req, res, done) {
  var email = req.body.email;

  if (!email) return done('Missing email');

  done(null, email);
};