/*
 * Module dependencies
 */
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var morgan = require('morgan');
var uuid = require('node-uuid');
 
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

if (process.env.NODE_ENV == 'production') {
  logstyle = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';
} else {
  logstyle = ':method :url :status :response-time ms - :res[content-length]';
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(assignId);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':id :method :url :response-time'));
}

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

app.listen(3000);

module.exports = app;
