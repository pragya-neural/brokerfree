var express = require('express');
var router = express.Router();
var app = express();
var curd_module = require('./crud_module');

router.get('/home', function(req, res, next) {
    res.render('admin/home', { title: 'Nobroker Admin-Panel'});
  });


  router.get('/userreport', function(req, res, next) {
    var where = "active_status is not null";
    curd_module.all_data_select('user_id,user_login,name,email_id,mobile_no,user_type,active_status','users',where,'user_id desc',function(user_detail){
      var obj = {};
      obj.user_detail = user_detail;
     
    res.render('admin/userreport', { title: 'Nobroker Users Report', obj:obj });
  
  });
});

router.get('/propertyreport', function(req, res, next) {
  var where = "p.active_status is not null";
  var from ="property p left join property_type pt on p.property_type_id=pt.property_type_id left join property_purpose pp on p.property_type_id=pp.property_purpose_id left join bhk_type bt on p.bhk_type_id=bt.bhk_type_id left join users u on p.user_id=u.user_id";
  curd_module.all_data_select('property_id,p.user_id,name,DATE_FORMAT(p.creation_date, "%d %M %Y") creation_date,property_type,property_purpose_name,apartment_name,no_of_unit,bt.bhk_type,p.active_status',from,where,'user_id desc',function(prop_detail){
    var obj = {};
    obj.prop_detail = prop_detail;
   
  res.render('admin/propertyreport', { title: 'Nobroker Properties Report', obj:obj });

});
});



module.exports = router;
