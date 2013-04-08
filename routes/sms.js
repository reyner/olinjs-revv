exports.load = function(req, res){
	var client = new twilio.RestClient('ACdd2af7b3991b85c37ef50d5aba5894a6', '0b36a23e971506e25b78f6912446d713');
  	res.render('index', { title: 'Express' });
};