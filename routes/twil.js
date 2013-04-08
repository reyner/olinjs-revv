var twilio = require('twilio');
var client = new twilio.RestClient('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

exports.run = function(req, res){
  res.render('index', { title: 'Express' });
};