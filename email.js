require("dotenv").config();
var nodemailer = require('nodemailer');

 var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.MAILGUN_USER_ID, // postmaster@sandbox[base64 string].mailgain.org
      pass: process.env.MAILGUN_USER_PASS // You set this.
    }
  });


function sendAnEmail (sender, receiver, inputText){
  var mailOptions = {
      from: "timeswapapp@gmail.com", 
      to: receiver, // list of receivers
      subject: "a fellow TimeSwap user would like to swap with you", // Subject line
      text: inputText, //, // plaintext body
      replyTo: sender
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      };
  });
}



module.exports = {
  sendAnEmail: sendAnEmail
};