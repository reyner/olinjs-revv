var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_KEY, process.env.TWILIO_SECRET);

exports.load = function(req, res){
    console.log(req.body);
    res.send(req.body);
};