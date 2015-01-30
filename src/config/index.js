var config = {};

config.development = {};
config.production = {};
config.test = {};
config.production.log = {};
config.development.log = {};
config.test.log = {};

config.test.log.directory = process.env.LOG_DIR || process.cwd();
config.test.log.accessLog = process.env.ACCESS_LOG || config.test.log.directory + '/access.log';
config.test.log.level = 'hide';
config.test.log.screen = 'hide';

config.development.log.directory = process.env.LOG_DIR || process.cwd();
config.development.log.accessLog = process.env.ACCESS_LOG || config.development.log.directory + '/access.log';
config.development.log.level = 'hide';
config.development.log.screen = 'debug';

config.production.log.directory = process.env.LOG_DIR || '/var/log/cloudykangaroo';
config.production.log.accessLog = process.env.ACCESS_LOG || config.production.log.directory + '/access.log';
config.production.log.level = 'hide';
config.production.log.screen = 'debug';

module.exports = config;
