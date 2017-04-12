module.exports = function(req, res, next) {
  var self = this,
      model = req.model,
      userId = model.get('_session.userId'),
      userIds = req._passport.session.user || [],
      url = req.url,
      urlParts = url.split('?'),
      pathName = urlParts[0],
      queryString = urlParts[1],
      multiloginSettings = this.options.multiloginSettings || {},
      ignoredRoutes = multiloginSettings.ignoredRoutes || [];


  if (/u\/\d+\/?$/.test(pathName)) {
    var indexOfUserId = pathName.match(/u\/(\d+)\/?$/)[1];
    userId = userIds[indexOfUserId];
    next()
  } else {
    var indexOfUserId = userIds.indexOf(userId);
    if (indexOfUserId === -1) indexOfUserId = 0;

    url = pathName.replace(/\/u(.*)$|\/$/, '') + '/u/' + indexOfUserId;
    if (queryString) url += '?' + queryString;

    if (ignoredRoutes.indexOf(pathName) === -1) {
      return res.redirect(url);
    } else {
      next()
    }
  }

}
