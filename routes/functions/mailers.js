var nodemailer = require("nodemailer");
let transport = nodemailer.createTransport({
    host: "mail.jimcr.com",
    secure: false, // use SSL
    port: 587,
    auth: {
      user: 'info@jimcr.com', // generated ethereal user
      pass: 'info!@#' // generated ethereal password
    },
    tls: {
          rejectUnauthorized: false
      }
  });

function sign_up_mail(to_id){
      const message = {
        from: 'info@nobrokarr.com', // Sender address
        to: to_id,         // List of recipients
        bcc:'ravishankar.k@neuralinfo.org',
        subject: 'Nobrokarr email Verfication!', // Subject line
        html: 'Thank You for register on Nobrokarr<br>Your Verification Code is: <b>'+code+'</b>' // Plain text body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}
module.exports.sign_up_mail=sign_up_mail;