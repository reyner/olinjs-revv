var twilio = require('twilio');
var client = new twilio.RestClient('ACdd2af7b3991b85c37ef50d5aba5894a6', '0b36a23e971506e25b78f6912446d713');

exports.load = function(req, res){
  	res.render('index', { title: 'Express' });
};