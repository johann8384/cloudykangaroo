process.env.NODE_ENV = 'test';
process.env.LOG_DIR = '/tmp';

var app = require('../src/app');
var request = require('supertest');
var assert = require('assert');
var port = 3333;
var server;

// Test Writing reference:
// https://github.com/visionmedia/supertest
// https://github.com/visionmedia/express/tree/master/test

describe('GET /', function(){
  beforeEach(function(){
    server = app.listen(3000);
  });
  it('should return code 200', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });
  afterEach(function(){
    server.close();
  })
});
