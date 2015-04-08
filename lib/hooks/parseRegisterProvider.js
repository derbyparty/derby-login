module.exports = function(user, provider, profile, done) {
  // you can modify user data by provider data from profile here
  // for example:
  /*
  switch (provider) {
    case 'linkedin':
      user.firstname = profile.name.familyName
      user.lastname = profile.name.givenName
      break;
  } */
  done(null, user)
}
