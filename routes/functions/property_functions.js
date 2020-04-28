var crud_module = require('../crud_module');

function get_incomplete_property(req,res,cb){
  console.log(req);
var uid = req.session.uid;
var query = "SELECT p.property_id,pt.property_type,pp.property_purpose_name,p.apartment_name,bt.bhk_type,p.active_status,p.no_of_unit,pi.image_name FROM property p left join property_type pt on p.property_type_id=pt.property_type_id left join property_purpose pp on p.property_type_id=pp.property_purpose_id left join bhk_type bt on p.bhk_type_id=bt.bhk_type_id left join property_gallery pi on pi.property_id=p.property_id where p.active_status='incomplete' and user_id="+uid+"GROUP by p.property_id";
crud_module.execute_query(query,function(result){
cb(result);
});
}

module.exports.get_incomplete_property=get_incomplete_property;

