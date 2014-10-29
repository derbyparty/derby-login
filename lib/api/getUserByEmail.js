module.exports = function(email, done) {
  var self = this;
  var model = self.store.createModel();

  // Look for user with given email
  var query = { $limit: 1 };
  query[
    self.options.localField + '.' +
    self.options.emailChangeField + '.' +
    self.options.emailField
  ] = email;
  var $userQuery = model.query(self.options.collection, query);

  model.fetch($userQuery, function(err) {
    if (err) return done(err);

    var user = $userQuery.get()[0];

    // Return error if no user
    if (!user) return done(self.error('noUserByEmail'));

    // Return user as scoped model
    var $user = model.at(self.options.collection + '.' + user.id);
    done(null, $user);
  });
}
