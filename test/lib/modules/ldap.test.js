/*global it:false */
/*global describe:false */
var assert = require('assert');
process.env.NODE_ENV = 'test';
process.env.LOG_DIR = './';

var credentials = require('../../../src/config/system-dev-credentials')();

var config = {};

config.mgmtDomain = '.unittest.us';

config.log = {};
config.log.level = 'hide';
config.log.screen = 'hide';
config.log.directory = '/tmp';


config.redis = {};
config.redis.port = '6379';
config.redis.host = 'localhost';
config.redis.db = 1;

config.sensu = {};
config.sensu.host = 'localhost';
config.sensu.port = 4567;
config.sensu.uri = 'http://' + config.sensu.host + ':' + config.sensu.port;

config.puppetdb = {};
config.puppetdb.host = 'localhost';
config.puppetdb.port = 8080;
config.puppetdb.uri =  'http://' + config.puppetdb.host + ':' + config.puppetdb.port + '/v3';

config.ldapModule = {};
config.ldapModule.class = '../../../test/lib/modules/ldap.stub.js';

var logger = {};

logger.log = function () {
  "use strict";
};

var redis = require("fakeredis");
var redisClient = redis.createClient(config.redis.port, config.redis.host);

require('../../../src/lib/nock')(config, logger);

/*
 Need tests for:
 handle, is, can, use
 */
describe("modules.ldap broken config tests", function (){
  "use strict";
  it('should throw an error with no ldap module defined', function () {
    assert.throws(
      function () {
        var email = 'test@example.org';
        var brokenLDAPModuleConfig = config;
        brokenLDAPModuleConfig.ldapModule = {};
        var brokenLDAPModule = require('../../../src/lib/modules/ldap')(config, logger, credentials, redisClient);
      },
      function (err) {
        return ( (err instanceof Error) && err.message === 'no ldapModule specified in configuration' );
      },
      "unexpected error"
    );
  });
});

describe("modules.ldap.getUserByEmail", function (){
  "use strict";
  it('should return the test user by email address', function () {
    var email = 'test@example.org';
    var ldapModule = require('../../../src/lib/modules/ldap')(config, logger, credentials, redisClient);
    ldapModule.getUserByEmail(email, function (err, user) {
      assert.equal(user.emails[0].value, email);
      assert.equal('test', user.username);
    });
  });
});
