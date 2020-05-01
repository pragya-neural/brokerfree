var crud_module = require('../crud_module');
var nodemailer = require("nodemailer");
function get_incomplete_property(req,res,cb){
var uid = req.session.uid;
var query = "SELECT DISTINCT p.property_id,pt.property_type,pp.property_purpose_name,p.apartment_name,bt.bhk_type,p.active_status,p.no_of_unit,pi.image_name,pl.street,pc.name as city,ps.name as state FROM property p left join property_type pt on p.property_type_id=pt.property_type_id left join property_purpose pp on p.property_type_id=pp.property_purpose_id left join bhk_type bt on p.bhk_type_id=bt.bhk_type_id left join property_gallery pi on pi.property_id=p.property_id left join property_location pl on pl.property_id=p.property_id left join cities pc on pc.city_id=pl.location_id left join states ps on ps.state_id=pl.state_id where p.user_id="+uid+" order by p.property_id DESC limit 2";

crud_module.execute_query(query,function(result){
cb(result);
});
}

function send_mail() {
 
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
  
    const message = {
      from: 'info@nobrokarr.com', // Sender address
      to: 'ravishankar.k@neuralinfo.org',         // List of recipients
      bcc:'ravinricnb@gmail.com',
      cc:'ravinribpl@gmail.com',
      subject: 'Test mail', // Subject line
      html: '<b>Have the most fun you can in a car.</b>' // Plain text body
  };
  transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
  }


module.exports.get_incomplete_property=get_incomplete_property;
module.exports.send_mail=send_mail;