module.exports = function(err, methodOrProvider, req, res) {
  // Some operation just finished and we should send response
  // It can differ based on arguments:
  // err - if it's absent, operation was successful, otherwise it failed
  // methodOrProvider - it shows type of operation: 'login', 'logout',
  // 'changepassword', 'recoverpassword', 'resetpassword', 'register',
  // or provider's name for OAuth operations: 'google', 'github', etc
  // req.xhr - shows if request was XmlHttpRequest or not

  // Parse error message
  if (err && err.toString) {
    err = err.toString();
  }

  // Built-in components send xhr requests and wait
  // for {error: errorMessage} JSON in case of error
  // and {success: true, url: redirectUrl} JSON in case of success
  if (req.xhr) {
    if (err) return res.json({error: err});

    switch (methodOrProvider) {
      case 'register':
        var url = this.options.confirmRegistrationUrl;
        if (!this.options.confirmRegistration) url = this.options.successUrl;
        return res.json({success: true, url: url});
      // do not send redirect url, to emit component success event
      case 'changeemail':
        return res.json({success: true});
      case 'changepassword':
        return res.json({success: true});
      case 'recoverpassword':
        return res.json({success: true});
      case 'resetpassword':
        return res.json({success: true});
      default:
        return res.json({success: true, url: this.options.successUrl});
    }
  }

  if (methodOrProvider === 'confirmemailchange') {
    if (err) return res.send(err);
    return res.redirect(this.options.emailChangeConfirmedUrl);
  }

  if (methodOrProvider === 'confirmregistration') {
    if (err) return res.send(err);
    return res.redirect(this.options.registrationConfirmedUrl);
  }

  // Redirect in case if it's not xhr request
  res.redirect(err ? req.get('Referrer') : this.options.successUrl);
};