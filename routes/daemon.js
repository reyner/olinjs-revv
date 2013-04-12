var MailListener = require("mail-listener");
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_KEY, process.env.TWILIO_SECRET);

exports.run = function(req, res) {
  User.find({},function(err,docs){ 
      docs.forEach(function(elem, index, array) {
        go(elem.email_address, elem.email_password, elem.phone_number)
      });
      res.send("Texting completed");
  }); 
}

function go (u, p, phone) {
  var options = {
    username: u,
    password: p,
    host: "imap.gmail.com",
    port: 993, // imap port
    secure: true, // use secure connection
    mailbox: "INBOX", // mailbox to monitor
    fetchUnreadOnStart: true // use it only if you want to get all unread email on lib start. Default is `false`
  };
  var mailListener = new MailListener(options);

  mailListener.start();

  mailListener.on("server:connected", function(){
    console.log("imapConnected");
  });

  mailListener.on("server:error", function(error){
    console.log("imapError", error);
  });

  mailListener.on("mail:parsed", function(mail){
    // do something with mail object including attachments
    console.log("emailParsed", mail.subject);
    var out = "FROM: " + mail.from[0].name + " SUBJECT: " + mail.subject + " MSG: " + mail.text;
    client.sms.messages.create({
        to:phone,
        from:'+14076245704',
        body: out.substring(0,160)
    }, function(error, message) {
        if (!error) {
          console.log('Success! The SID for this SMS message is:');
          console.log(message.sid);
          console.log('Message sent on:');
          console.log(message.dateCreated);
        }
        else {
          console.log('twilio error');
        }
    });
  });
}