var express = require('express');
var router = express.Router();
var app = express();
var curd_module = require('./Curd_module');
var buffer = require('buffer/').Buffer;
console.log(buffer.from('2').toString('base64'));
console.log(buffer.from("SGVsbG8gVmlzaGFsIFRoYWt1cg==", 'base64').toString('ascii'))
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
  curd_module.data_insert_return_id('property',data,function(){
    res.redirect("/property/property-details");
  })
  
});

router.get('/property-details', function(req, res, next) {
  res.render('property-details', { title: 'Property Details', sideselection: 'property' });
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
