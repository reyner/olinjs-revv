var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_KEY, process.env.TWILIO_SECRET);

exports.load = function(req, res){
    client.sms.messages.create({
        to:req.session.user.phone_number,
        from:'+14076245704',
        body:'This is where your email text goes'
    }, function(error, message) {
        if (!error) {
            
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
     
            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
        else {
            console.log('Oops! There was an error.');
        }
    });
};