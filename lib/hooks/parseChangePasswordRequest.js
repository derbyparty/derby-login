module.exports = function(req, res, done) {
  var oldpassword = req.body.oldpassword;
  var password = req.body.password;
  var confirm = req.body.confirm;

  if (!oldpassword || !password || !confirm) return done('Please fill all fields');
  if (password !== confirm) return done('Password should match confirmation');

  done(null, oldpassword, password);
};