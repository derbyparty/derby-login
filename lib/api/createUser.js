module.exports = function(email, pwd, userData, done) {
  var self = this;
  
  self.userExists(email, function (err, e) {
    if (err) return done(err);
    
    if (!e) {
      self.register(email, pwd, userData, function (err, uID) {
        if (err) return done(err);
        
        self.confirmEmail(uID, function (err) {
          return done(err);
        });
      });
    }
  });
}

