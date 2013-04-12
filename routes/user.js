var models = require('../models');
var User = models.User;
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_KEY, process.env.TWILIO_SECRET);

exports.new = function(req, res){
	console.log(req.body);

	var user = new User({
		phone_number: req.body.phone_number, 
		email_address: req.body.email_address, 
		email_password: req.body.email_password
	});

	req.session.user = user;

	user.save(function (err){
		if (err){
			return console.log("error", err);
		}
		else{
			client.sms.messages.create({
			    to:user.phone_number,
			    from:'+14076245704',
			    body:'Welcome to MailMS'
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
			        // console.log(error);
			    }
			});
			res.render('user');
		}
	});
};

exports.list = function(req, res){
  var query = User.find({});
  query.exec(function (err, docs) {
    if (err)
      return console.log("error", err);
    res.render('user_list', {users: docs, title: 'List of users'});
  });
};

exports.delete_all = function(req, res){
  User.remove({}, function(err) { 
    console.log('collection removed') 
  });
  res.send("deleted");
};