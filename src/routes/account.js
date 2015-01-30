module.exports = function (app, config) {
  "use strict";

  app.get('/', function (req, res) {
    var opts = { title: 'Home' };
    res.render('index', otps);
  });
};
