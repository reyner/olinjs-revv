
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , twilio = require('twilio')
  , Imap = require('imap')
  , sms = require('./routes/sms')
  , imapRoute = require('./routes/imap')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var imap = new Imap({
  user: process.env.GMAIL_LOGIN,
  password: process.env.GMAIL_PASS,
  host: 'imap.gmail.com',
  port: 993,
  secure: true
}), box;

function openInbox (next) {
  imap.connect(function (err) {
    if (err) {
      console.error('Error connecting', err);
      process.exit(1);
    }
    next();
  });
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/imap/search', imapRoute.search);
app.get('/imap/messages', imapRoute.messages);

app.post('/sms', sms.load);

openInbox(function () {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  })
});