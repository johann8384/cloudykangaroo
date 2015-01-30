module.exports = function (app, config) {
  "use strict";

  app.get('/login', function (req, res) {
    var opts = { title: 'Home' };
    res.render('login', opts);
  });
};