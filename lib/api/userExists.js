module.exports = function(email, done) {
  var self = this;
  var model = self.backend.createModel();
  
  email = email.toLowerCase();

  // Look for user with given email
  var query = { $limit: 1 };
  query[self.options.emailField] = {
    $regex: '^' + email.replace(/[.*+=~%&`#!?^${}()|[\]\\]/g, '\\$&') + '$',
    $options: 'i'
  };
  var $userQuery = model.query(self.options.collection, query);

  model.fetch($userQuery, function(err) {
    if (err) { return done(err); }

    var user = $userQuery.get()[0];

    // Return boolean
    done(null, !!user, user);
  });
}
