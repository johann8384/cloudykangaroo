/**
 * Application Dependencies
 */

var config = require('./config');

var userPropertyConfig = { userProperty: 'currentUser' };
var menus = require('./lib/menus')(userPropertyConfig);
var utils = require('./lib/utils');
var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var useragent = require('express-useragent');

/*
 Configuration
 */

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  throw new Error(process.env.NODE_ENV +  ' is not a known environment, cannot proceed');
}

config.log = config[process.env.NODE_ENV].log;

var credentials;
credentials = require(config.credentials.class)();

/*
 Initialize the Logging Framework
 */

// Application Logs
var ctxlog = require('contegix-logger');
var logger = ctxlog('main', config.log.level, config.log.directory, { level: config.log.screen}, {level: config.log.level});

// Access Logs
var reqLogger = require('express-request-logger');
var fs = require('fs');
var logstream = fs.createWriteStream(config.log.accessLog, {flags: 'a'});

// Generic Requirements
var redis = {};

if (config.redis && config.redis.class) {
  redis = require(config.redis.class);
} else {
  throw new Error('redis class not specified REDIS_CLASS environment variable of config.redis.class');
}

if (config.USE_NOCK === 'true') {
  require('./lib/archive/nock')(config, logger);
}

/* Connect to Redis */
var redisClient = redis.createClient(config.redis.port, config.redis.host);

redisClient.on('error', function (error) {
  "use strict";
  logger.log('error', 'Redis Connect Error: ' + error.message, { error: error });
});

redisClient.on("connect", function () {
  "use strict";
  redisClient.select(config.redis.db, function (error, response) {
    if (error) { throw error; }

    if (response !== 'OK') {
      logger.log('warn', 'Unexpected response on Redis Connect', {response: response});
    }

    var redisTestUID = utils.uid(16);
    redisClient.set('test_' + redisTestUID, redisTestUID);
    redisClient.get('test_' + redisTestUID, function (error, response) {
      if (error)
      {
        logger.log('error', 'Error retrieving value from Redis during startup test', error);
      } else {
        if (response !== redisTestUID)
        {
          logger.log('error', 'Redis returned the incorrect value for redisTestUID', {
            redisTestUID: redisTestUID,
            response: response
          });
        }
      }
    });
  });
});

/* Load the application metrics module */
try {
  var appMetrics = require('./lib/metrics')(logger, config);
} catch (e) {
  logger.log('error', 'Could not initialize appMetrics Module', { error: e.message});
  throw e;
}

/**
 * The Start of the Application Logic
 */

var app = express();

var pjson = require('../package.json');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
var session = require('express-session')

// all environments
app.locals.config = config;
app.locals.logger = logger;
app.locals.appMetrics = appMetrics;
app.locals.title = 'Cloudy Kangaroo';
app.locals.version = pjson.version;
app.locals.addMenuContent = menus.addMenuContent;
app.locals.addMenuItem = menus.addMenuItem;

app.enable('trust proxy');

app.set('title', 'Cloudy Kangaroo');
app.set('port', config.http.port || 3000);
/*jslint nomen: true*/
app.set('views', path.join(__dirname, 'views'));
/*jslint nomen: false*/
app.set('view engine', 'jade');
//app.use(bodyParser());
app.use(reqLogger.create(logger));
app.use(morgan('combined', {stream: logstream }));
app.use(compression());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(require('connect-requestid'));
app.use(useragent.express());

/*
 Initialize the session and prepare user authentication
 */

app.use(cookieParser(config.cookie.secret))
var session = require('express-session') , RedisStore = require('connect-redis')(session);

app.use(session({
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis.port
  }),
  secret: config.cookie.secret
}));

var userManagement = require('./lib/userManagement')(app, config, credentials, redisClient);
app.use(userManagement.middleware());

/*
End user Auth
 */

app.use(flash());

/* Route requests through the metrics and logging processing */
app.use(appMetrics.reqWrapper);

/* Last chance, perhaps it is a static resource, most of this offloaded to Nginx */
/*jslint nomen: true*/
app.use(express.static(path.join(__dirname, 'public')));

/*jslint nomen: false*/
/* Development Environment Code */
/*app.configure('development', function () {
  "use strict";
  app.use(express.errorHandler());
  app.locals.pretty = true;
});
*/
require("./routes")(app, config, authenticator, redisClient);

var server = require('http').createServer(app);

if (!module.parent) {
  server.listen(app.get('port'), function () {
    "use strict";
    logger.log('info', 'Express server listening on port ' + app.get('port'), {});
    logger.log('silly', 'Route Listing', {routes: app.routes});
  });
}

module.exports = app;
