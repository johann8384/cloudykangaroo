module.exports = function(app, credentials, config, redisClient) {
  "use strict";

  var authenticator = require('./auth')(app, credentials, config, redisClient);
  var roleManager = require('./roleManager')(app, config.roles);
  var roleHandler = roleManager.roleHandler;

  authenticator.roleManager = roleHandler;

  if (process.env.NODE_ENV === 'test') {
    app.use(authenticator.mockPassport.initialize(userPropertyConfig));
  } else {
    app.use(authenticator.passport.initialize(userPropertyConfig));
  }

  app.use(authenticator.passport.session());
  app.use(roleHandler.middleware());
  app.use(authenticator);
  app.use(oauth2);
  app.use(roleManager);
  app.use(menus);

  return authenticator;
};