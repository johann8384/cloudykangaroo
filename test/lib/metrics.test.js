/*global it:false */
/*global describe:false */
process.env.NODE_ENV = 'test';
process.env.LOG_DIR = './';

var config = {};

config.log = {};
config.log.level = 'hide';
config.log.screen = 'hide';
config.log.directory = '/tmp';

var logger = {};

logger.log = function () {
  "use strict";
};

var utils = {};
utils.date = function () {
  return new Date('Thu Jan 29 2015 23:45:26 GMT-0800 (PST)');
}
utils.uid = function () {
  return 'fdoAHC1Gigw9MGPk';
}

var assert = require('assert');

/*
 Need tests for:
 handle, is, can, use
 */

describe("metrics reqWrapper", function (){
  "use strict";
  var req = {};
  req.on = function (method, callback) {
    "use strict";
  }
  var res = {};
  res.locals = {};

  it('should populate return info', function () {
    var metrics = require('../../src/lib/metrics')(logger, config, utils);
    metrics.reqWrapper(req, res, function() {
      assert.equal('Thu Jan 29 2015 23:45:26 GMT-0800 (PST)', req._rlStartTime);
      assert.equal('fdoAHC1Gigw9MGPk', res.locals.token);
    });
  });
});
