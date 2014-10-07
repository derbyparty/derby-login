module.exports = function(email, done) {
  var self = this;
  var model = self.store.createModel();

  self.getUserByEmail(email, function(err, $user) {
    if (err) return done(err);

    // Generate secret as uuid
    var secret = model.id();

    // Save secret to user
    var passwordReset = {
      secret: secret,
      timestamp: +new Date()
    }
    $user.set(self.options.localField + '.passwordReset', passwordReset, function(err) {
      if (err) return done(err);

      // Return secret and userId
      done(null, secret, $user.get('id'));
    });
  });
}
