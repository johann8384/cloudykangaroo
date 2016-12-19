var chai = require('chai');
var expect = chai.expect;

var crmModuleConfig = {
  mgmtDomain: '.perspica.io',
  redisPort: 6379,
  redisHost: 'localhost',
  redisDb: 0,
  logLevel: 'hide',
  region: 'us-east-1',
  logDir: '/tmp',
  warm_cache: false
};


var cloudyAmazonSmith = require('./../index')(crmModuleConfig);

describe('cloudyAmazonSmith', function() {
  it('getAllDevices() should return some devices', function(done) {
    cloudyAmazonSmith.getAllDevices(function (err, deviceList) {
      console.log(deviceList);
      expect(deviceList.length).to.equal(8);
      done();
    });
  });
});
