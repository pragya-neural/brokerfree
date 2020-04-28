var crud_module = require('../crud_module');
function get_incomplete_property(req,res,cb){
var uid = req.session.uid;
var query = "SELECT p.property_id,pt.property_type,pp.property_purpose_name,p.apartment_name,bt.bhk_type,p.active_status,p.no_of_unit,pi.image_name,pl.street,pc.name as city,ps.name as state FROM property p left join property_type pt on p.property_type_id=pt.property_type_id left join property_purpose pp on p.property_type_id=pp.property_purpose_id left join bhk_type bt on p.bhk_type_id=bt.bhk_type_id left join property_gallery pi on pi.property_id=p.property_id left join property_location pl on pl.property_id=p.property_id left join cities pc on pc.city_id=pl.location_id left join states ps on ps.state_id=pl.state_id where p.user_id="+uid+" GROUP by p.property_id order by p.property_id DESC limit 2";
crud_module.execute_query(query,function(result){
cb(result);
});
}

module.exports.get_incomplete_property=get_incomplete_property;

