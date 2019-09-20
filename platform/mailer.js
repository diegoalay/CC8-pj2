var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'invernadero.gt@gmail.com',
    pass: 'Invernadero-123'
  }
});

var mailOptions = {
  from: 'invernadero.gt@gmail.com',
  to: 'diegoyop@hotmail.com',
  subject: 'Invernadero GT',
  text: 'Hey your plants have just been watered.',
//   html: '<h1>Welcome</h1><p>That was easy!</p>'
};

exports.sendMail = function(){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}