var express = require('express');
var router = express.Router();
var app = express();
var curd_module = require('./Curd_module');
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

app.use(checkLogin);

/* GET property page. */
router.get('/',checkLogin,function(req, res, next) {
  var where = "active_status='active'";
  curd_module.all_data_select('property_type_id,property_type','property_type',where,'property_type_id desc',function(pro_type){
  var where = "active_status='active'";
  curd_module.all_data_select('property_purpose_id,property_purpose_name','property_purpose',where,'property_purpose_id desc',function(purpose){
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
  curd_module.data_insert_return_id('property',data,function(id){
    var enc_pro_id = id;
    res.redirect("/property/property-details/"+enc_pro_id);
  });
  
});

//update property
router.post('/update-property',checkLogin,function(req, res, next) {
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
  var where="property_id="+req.body.property_id;
  curd_module.update_data('property',data,where,function(){
    res.redirect("/property"); 
  })
});

router.get('/property-details/:pid', checkLogin,function(req, res, next) {
  var pid = req.params.pid;
  where = "active_status='active'";
  curd_module.all_data_select('apartment_type_id,apartment_type','apartment_type',where,'apartment_type_id desc',function(apartment_type){
    curd_module.all_data_select('bhk_type_id,bhk_type','bhk_type',where,'bhk_type_id desc',function(bhk_type){
    curd_module.all_data_select('ownership_type_id,ownership_type','ownership_type',where,'ownership_type_id desc',function(ownership_type){
    curd_module.all_data_select('property_age_id,property_age','property_age',where,'property_age_id ASC',function(property_age){
    curd_module.all_data_select('facing_id,facing_name','facing',where,'facing_id ASC',function(facing){
    curd_module.all_data_select('floor_id,floor_name','floor',where,'floor_id ASC',function(floor){
    curd_module.all_data_select('floor_type_id,floor_type','floor_type',where,'floor_type_id ASC',function(floor_type){
    var obj = {};
    obj.apartment_type=apartment_type;
    obj.bhk_type=bhk_type;
    obj.ownership_type=ownership_type;
    obj.property_age=property_age;
    obj.facing=facing;
    obj.floor=floor;
    obj.floor_type=floor_type;
    obj.property_id = pid;
    res.render('property-details', { title: 'Property Details', sideselection: 'property',obj:obj });
  });
});
});
});
});
});
});
});

router.get('/locality-details', function(req, res, next) {
  res.render('locality-details', { title: 'Locality Details', sideselection: 'locality' });
});

router.get('/resale-details', function(req, res, next) {
  res.render('resale-details', { title: 'resale-deetails', sideselection: 'resale' });
});

router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'Gallery', sideselection: 'gallery' });
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
