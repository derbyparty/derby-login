module.exports = function(userId, email, secret, done) {
  // Place to send a letter with revovery link to your page with
  // resetpassword component
  // Include secret in url, ex: /<recoverPasswordUrl>?secret=<secret>
  // Create route, where you parse secret and render page with resetpassword component
  // Put secret in model, ex: model.set('_page.secret', secret);
  // And pass it to resetpassword component, ex:
  // <view name='auth:resetpassword' secret='{{_page.secret}}' />
  done();
};