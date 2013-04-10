var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_KEY, process.env.TWILIO_SECRET);

exports.load = function(req, res){
    res.send(req.body);
};