var config = require('./config');

/*
 * Module dependencies
 */
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var morgan = require('morgan');
var uuid = require('node-uuid');
var useragent = require('express-useragent');
var reqLogger = require('express-request-logger');

/*
 Configuration
 */

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  throw new Error(process.env.NODE_ENV +  ' is not a known environment, cannot proceed');
}

config.log = config[process.env.NODE_ENV].log;

var ctxlog = require('contegix-logger');
var logger = ctxlog('main', config.log.level, config.log.directory, { level: config.log.screen}, {level: config.log.level});
//var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)() ] });

var utils = require('./lib/utils');

/* Load the application metrics module */
try {
  var appMetrics = require('./lib/metrics')(logger, config, utils);
} catch (e) {
  logger.log('error', 'Could not initialize appMetrics Module', { error: e.message});
  throw e;
}
 
morgan.token('id', function getId(req) {
  return req.id;
});

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

var logstyle = '';

app.use(useragent.express());

if (process.env.NODE_ENV == 'production') {
  logstyle = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';
} else {
  logstyle = ':method :url :status :response-time ms - :res[content-length]';
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(assignId);

if (process.env.NODE_ENV !== 'test') {
//  app.use(morgan(':id :method :url :response-time'));
  app.use(reqLogger.create(logger));
}


/* Route requests through the metrics and logging processing */
app.use(appMetrics.reqWrapper);

app.use(stylus.middleware({ src: __dirname + '/public', compile: compile}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  );
});

function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}

require("./routes")(app, config);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000);
}
module.exports = app;
