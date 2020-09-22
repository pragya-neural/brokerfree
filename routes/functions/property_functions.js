var crud_module = require('../crud_module');
var path = require('path');
var ejs = require('ejs');
var nodemailer = require("nodemailer");
var mailers = require('./mailers');
function get_incomplete_property(req,res,cb){
var uid = req.session.uid;
var query = "SELECT DISTINCT p.property_id,pt.property_type,pp.property_purpose_name,p.apartment_name,bt.bhk_type,p.active_status,p.no_of_unit,pi.image_name,pl.street,pc.name as city,ps.name as state FROM property p left join property_type pt on p.property_type_id=pt.property_type_id left join property_purpose pp on p.property_type_id=pp.property_purpose_id left join bhk_type bt on p.bhk_type_id=bt.bhk_type_id left join property_gallery pi on pi.property_id=p.property_id left join property_location pl on pl.property_id=p.property_id left join cities pc on pc.city_id=pl.location_id left join states ps on ps.state_id=pl.state_id where p.user_id="+uid+" order by p.property_id DESC limit 2";

crud_module.execute_query(query,function(result){
cb(result);
});
}

 function get_search_property(property_type,bhk_type,cb){

var query = "SELECT p.property_id,pt.property_type,pp.property_purpose_name,p.apartment_name,bt.bhk_type,p.active_status,p.no_of_unit,pi.image_name,pl.street,pc.name as city,ps.name as state FROM property p left join property_type pt on p.property_type_id=pt.property_type_id left join property_purpose pp on p.property_type_id=pp.property_purpose_id left join bhk_type bt on p.bhk_type_id=bt.bhk_type_id left join property_gallery pi on pi.property_id=p.property_id left join property_location pl on pl.property_id=p.property_id left join cities pc on pc.city_id=pl.location_id left join states ps on ps.state_id=pl.state_id where p.property_type_id="+property_type+" and p.bhk_type_id="+bhk_type+" order by p.property_id DESC limit 5";

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
    process.chdir("./views/mailers/");
    const template = process.cwd()+'/registration.ejs';
    ejs.renderFile(template, (err, html) => {  
    const message = {
      from: 'info@nobrokarr.com', // Sender address
      to: 'ravishankar.k@neuralinfo.org',         // List of recipients
      subject: 'Test mail', // Subject line
      html: html // Plain text body
  };
  transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
  });
}

module.exports.get_incomplete_property=get_incomplete_property;
module.exports.send_mail=send_mail;
module.exports.get_search_property=get_search_property;