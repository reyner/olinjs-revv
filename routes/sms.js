var twilio = require('twilio');
var client = new twilio.RestClient('ACdd2af7b3991b85c37ef50d5aba5894a6', '0b36a23e971506e25b78f6912446d713');

exports.load = function(req, res){
  	res.render('index', { title: 'Express' });
};

client.sms.messages.create({
    to:'+17038017814',
    from:'+14076245704',
    body:'ahoy hoy! Testing Twilio and node.js'
}, function(error, message) {
    
    // The HTTP request to Twilio will run asynchronously.  This callback
    // function will be called when a response is received from Twilio
    
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request.  In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
    }
    else {
        console.log('Oops! There was an error.');
    }
});