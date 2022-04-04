module.exports = function(secret, done) {
  var self = this;
  var model = self.backend.createModel();

  // Look for user with given secret
  var query = { $limit: 1 };
  query[self.options.localField + '.passwordReset.secret'] = secret;
  var $userQuery = model.query(self.options.collection, query);

  model.fetch($userQuery, function(err) {
    if (err) {
      model.close();
      return done(err);
    }

    var user = $userQuery.get()[0];

    // Return error if no user
    if (!user) {
      model.close();
      return done(self.error('noUserBySecret'));
    }

    // Return user as scoped model
    var $user = model.at(self.options.collection + '.' + user.id);
    done(null, $user);
  });
}
