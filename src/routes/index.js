module.exports = function (app, config) {
  "use strict";
  require('./account')(app, config);

  app.get('/', function (req, res) {
    var opts = { title: 'Home' };
    res.render('index', opts);
  });
};
