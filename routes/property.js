var express = require('express');
var router = express.Router();
var app = express();
var crud_module = require('./crud_module');
var checkLogin = function (req, res, next) {
  if (req.session.loggedin==true) {
	  res.locals.username = req.session.username;
	  res.locals.name = req.session.name;
	  res.locals.uid = req.session.uid;
		next();
	} else {
		res.redirect("/");
	}
}

var checkproperty = function (req, res, next) {
  var pid=req.params.pid;
  var uid = req.session.uid;
  var where="user_id="+uid+" and property_id="+pid;
  crud_module.num_rows('property',where,function(tcount){
    if(tcount==0){
      res.redirect("/");
      
    }
  });
  next();
}

app.use(checkLogin);
//app.use(checkproperty);
/* GET property page. */
router.get('/',checkLogin,function(req, res, next) {
  var where = "active_status='active'";
  crud_module.all_data_select('property_type_id,property_type','property_type',where,'property_type_id desc',function(pro_type){
  var where = "active_status='active'";
  crud_module.all_data_select('property_purpose_id,property_purpose_name','property_purpose',where,'property_purpose_id desc',function(purpose){
    var obj = {};
    obj.purpose = purpose;
    obj.pro_type = pro_type;
    res.render('property', { title: 'Property Entry', sideselection: 'property',obj:obj });
  });
 });
});
//save property
router.post('/save-property',checkLogin,function(req, res, next) {
  var pro_type = req.body.pro_type;
  var purpose = req.body.purpose;
  var data={
    "property_type_id":pro_type,
    "purpose_type_id":purpose,
    "user_id":req.session.uid,
    "creation_date":new Date()
      }
  crud_module.data_insert_return_id('property',data,function(id){
    var enc_pro_id = id;
    var pro_id={"property_id":id}
    crud_module.data_insert_return_id('property_location',pro_id,function(id){
    crud_module.data_insert_return_id('resale_rental_details',pro_id,function(id){
    crud_module.data_insert_return_id('property_gallery',pro_id,function(id){
    crud_module.data_insert_return_id('nearby_details',pro_id,function(id){
    crud_module.data_insert_return_id('basic_amenities',pro_id,function(id){
    res.redirect("/property/property-details/"+enc_pro_id);
  });
  });
  });
});
});
});
});

//update property
router.post('/update-property',checkLogin,function(req, res, next) {
  var enc_pro_id = req.body.property_id;
  var data={
    "apartment_type_id":req.body.apartment_type,
    "apartment_name":req.body.apartment_name,
    "bhk_type_id":req.body.bhk_type,
    "ownership_type_id":req.body.ownership_type,
    "property_size":req.body.property_size,
    "property_age_id":req.body.property_age,
    "facing_id":req.body.facing,
    "floor_id":req.body.floor,
    "total_floor_id":req.body.total_floor,
    "floor_type_id":req.body.floor_type,
    "no_of_unit":req.body.no_unit
    }
  var where="property_id="+enc_pro_id;
  crud_module.update_data('property',data,where,function(){
    res.redirect("/property/locality-details/"+enc_pro_id);
  })
});

router.get('/property-details/:pid', [checkLogin,checkproperty],function(req, res, next) {
  var pid = req.params.pid;
  where = "active_status='active'";
  where_id = "property_id="+pid;
  crud_module.fatch_single_row_data('*','property',where_id,function(property_data){
  crud_module.all_data_select('apartment_type_id,apartment_type','apartment_type',where,'apartment_type_id desc',function(apartment_type){
    crud_module.all_data_select('bhk_type_id,bhk_type','bhk_type',where,'bhk_type_id desc',function(bhk_type){
    crud_module.all_data_select('ownership_type_id,ownership_type','ownership_type',where,'ownership_type_id desc',function(ownership_type){
    crud_module.all_data_select('property_age_id,property_age','property_age',where,'property_age_id ASC',function(property_age){
    crud_module.all_data_select('facing_id,facing_name','facing',where,'facing_id ASC',function(facing){
    crud_module.all_data_select('floor_id,floor_name','floor',where,'floor_id ASC',function(floor){
    crud_module.all_data_select('floor_type_id,floor_type','floor_type',where,'floor_type_id ASC',function(floor_type){

    var obj = {};
    obj.apartment_type=apartment_type;
    obj.bhk_type=bhk_type;
    obj.ownership_type=ownership_type;
    obj.property_age=property_age;
    obj.facing=facing;
    obj.floor=floor;
    obj.floor_type=floor_type;
    obj.property_id = pid;
    obj.property_data=property_data;
    res.render('property-details', { title: 'Property Details', sideselection: 'property_detail',obj:obj });
  });
});
});
});
});
});
});
});
});

router.get('/locality-details/:pid', [checkLogin,checkproperty],function(req, res, next) {
  var pid = req.params.pid;
  var where_country='101';
  where_id = "property_id="+pid;
  crud_module.fatch_single_row_data('*','property_location',where_id,function(location_data){
  var current_state = location_data.state_id;
  var where_state = "state_id="+current_state;
  crud_module.all_data_select('city_id,name','cities',where_state,'city_id',function(curr_state_city){
  crud_module.all_data_select('state_id,name','states',where_country,'state_id ASC',function(states){
    var obj = {};
    obj.states=states;
    obj.location_data=location_data;
    obj.curr_state_city=curr_state_city;
    obj.property_id=pid;
  res.render('locality-details', { title: 'Locality Details', sideselection: 'locality',obj:obj });
  });
});
});
});

//update location
router.post('/update-location',checkLogin,function(req, res, next) {
  var enc_pro_id = req.body.property_id;
  var data={
    "state_id":req.body.state,
    "location_id":req.body.city,
    "street":req.body.street,
    "property_url":req.body.url
    }
  var where="property_id="+enc_pro_id;
  crud_module.update_data('property_location',data,where,function(){
    res.redirect("/property/resale-details/"+enc_pro_id);
  })
});

router.post('/fill-city-dd',checkLogin,function(req, res, next) {
  var state_id = req.body.State_id;
  var where_state="state_id="+state_id;
  var cites='<option value="">Select City</option>';
  crud_module.all_data_select('city_id,name','cities',where_state,'city_id ASC',function(cities){
  for(var a=0;a<cities.length;a++){
   cites += "<option value='"+cities[a].city_id+"'>"+cities[a].name+"</option>";
 }  
 res.send(cites);
  });
  
});

router.get('/resale-details/:pid',[checkLogin,checkproperty],function(req, res, next) {
  var pid = req.params.pid;
  where = "active_status='active'";
  where_id = "property_id="+pid;
  crud_module .fatch_single_row_data('*','resale_rental_details',where_id,function(resale){
  crud_module.all_data_select('furnishing_id,furnishing','furnishing',where,'furnishing_id DESC',function(furnish){
  crud_module.all_data_select('parking_id,parking','parking',where,'parking_id DESC',function(parking){
  crud_module.all_data_select('kitchen_type_id,kitchen_type','kitchen_type',where,'kitchen_type_id DESC',function(kitchen_type){
    var obj={};
    obj.furnish=furnish;
    obj.parking=parking;
    obj.kitchen_type=kitchen_type;
    obj.property_id=pid;
    obj.resale=resale;
    res.render('resale-details', { title: 'resale-deetails', sideselection: 'resale',obj:obj });
  });
});
});
});
});

//update resale details
router.post('/update-resale-details',checkLogin,function(req, res, next) {
  var enc_pro_id = req.body.property_id;
  var data={
    "expected_price":req.body.expected_price,
    "maintenance_cost":req.body.maintenance_cost,
    "lease_years":req.body.lease_years,
    "available_from":req.body.available_from,
    "furnishing_id":req.body.furnishing_id,
    "parking_id":req.body.parking_id,
    "kitchen_type_id":req.body.kitchen_type_id,
    "price_negotiable":req.body.price_negotiable,
    "current_loan_status":req.body.current_loan_status,
    "description":req.body.description
    }
  var where="property_id="+enc_pro_id;
  crud_module.update_data('resale_rental_details',data,where,function(){
    res.redirect("/property/gallery/"+enc_pro_id);
  })
});

router.get('/gallery/:pid',[checkLogin,checkproperty],function(req, res, next) {
  res.render('gallery', { title: 'Gallery', sideselection: 'gallery' });
});

//update property images
router.post('/update-property-images',checkLogin,function(req, res, next) {
  console.log(req);
  //var enc_pro_id = req.body.property_id;
  //var data={
    //"expected_price":req.body.expected_price,
    //"maintenance_cost":req.body.maintenance_cost,
   // "lease_years":req.body.lease_years,
    //"available_from":req.body.available_from,
    //"furnishing_id":req.body.furnishing_id,
   // "parking_id":req.body.parking_id,
   // "kitchen_type_id":req.body.kitchen_type_id,
    //"price_negotiable":req.body.price_negotiable,
   // "current_loan_status":req.body.current_loan_status,
    //"description":req.body.description
   // }
 // var where="property_id="+enc_pro_id;
 // crud_module.update_data('resale_rental_details',data,where,function(){
   // res.redirect("/property/gallery/"+enc_pro_id);
  //})
});

router.get('/nearby-details', function(req, res, next) {
  res.render('nearby-details', { title: 'Near By Details', sideselection: 'nearby' });
});

router.get('/amenities', function(req, res, next) {
  res.render('amenities', { title: 'Basic Amenities', sideselection: 'amenity' });
});

router.get('/addition-info', function(req, res, next) {
  res.render('addition-info', { title: 'Additional Information', sideselection: 'additional' });
});

router.get('/schedule', function(req, res, next) {
  res.render('schedule', { title: 'Time Schedule', sideselection: 'time' });
});


module.exports = router;
