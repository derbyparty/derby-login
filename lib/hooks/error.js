module.exports = function(key) {
  // User errors by key for localization support, though I'm still not sure
  // how to get user's session here to know the language

  var errors = this.options.errors || {};
  var message = errors[key] || 'Unknown Error';
  return new Error(message);
}
