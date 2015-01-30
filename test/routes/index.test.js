process.env.NODE_ENV = 'test';
process.env.LOG_DIR = './';

var app = require('../../src/app');
var request = require('supertest');
var assert = require('assert');

// Test Writing reference:
// https://github.com/visionmedia/supertest
// https://github.com/visionmedia/express/tree/master/test

describe('GET /', function(){
  it('should return code 200', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });
  it('should respond with html', function(done) {
     request(app)
       .get('/')
       .expect('Content-Type', 'text/html; charset=utf-8', done);
  });
  it('should be the welcome page', function(done) {
    request(app)
      .get('/')
      .expect(hasWelcomeText)
      .end(done);
  });
});

function hasWelcomeText(res) {
  var text = res.text;
  if (!(text.indexOf('Vivamus hendrerit arcu sed erat molestie'))) return "missing latin text";
  if (!(text.indexOf('Vivamus hendrerit arcu sed erat molestie'))) throw new Error("missing widget");
}
