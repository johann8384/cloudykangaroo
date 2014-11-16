module.exports = function (app, config, authenticator, redisClient) {
  "use strict";

  require('./auth')(app, config, authenticator, redisClient);
  require('./account')(app, config, authenticator, redisClient);

  app.get('/', function (req, res) {
    res.redirect('/account');
  });
};
