var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mailms_users');

var Schema = mongoose.Schema;
User_Schema = new Schema({ 
  phone_number: String,
  email_address: String,
  email_password: String
}),

User = mongoose.model('User', User_Schema);

exports.User = User;