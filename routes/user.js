var models = require('../models');
var User = models.User;

exports.new = function(req, res){
	console.log(req.body);

	var user = new User({
		phone_number: req.body.phone_number, 
		email_address: req.body.email_address, 
		email_password: req.body.email_password
	});

	user.save(function (err){
		if (err){
			return console.log("error", err);
		}
		else{
			res.send("Your new user \n" + req.body.phone_number + " has been added!");
		}
	});
};