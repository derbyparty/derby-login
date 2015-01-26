module.exports = function(req, res, done) {
  var userId = req.query.id;

  if (!userId) return done('Missing id');

  done(null, userId);
};