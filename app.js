
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , twilio = require('twilio')
  , sms = require('./routes/sms')
  , daemon = require('./routes/daemon')
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

app.get('/', routes.index);
app.get('/daemon', daemon.run);
app.get('/users/list', user.list);
app.get('/users/delete_all', user.delete_all);


app.post('/users', user.new);
app.post('/sms', sms.load);

// var sys = require('sys');
// app.post('/sms', function(req, res) {
//   var message = req.body.Body;
//   var from = req.body.From;
//   sys.log('From: ' + from + ', Message: ' + message);
//     var twiml = '<?xml version="1.0" encoding="UTF-8" ?>n<Response>n<Sms>Thanks for your text, well be in touch.</Sms>n</Response>';
//     res.send(twiml, {'Content-Type':'text/xml'}, 200);
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});