var express = require('express');
var router = express.Router();
var app = express();
var curd_module = require('./curd_module');

router.get('/home', function(req, res, next) {
    res.render('admin/home', { title: 'Nobroker Admin-Panel'});
  });

  router.get('/userreport', function(req, res, next) {
    var where = "active_status is not null";
    curd_module.all_data_select('user_id,user_login,name,email_id,mobile_no,user_type,active_status','users',where,'user_id desc',function(user_detail){
      var obj = {};
      obj.user_detail = user_detail;
     
    res.render('admin/userreport', { title: 'Nobroker Users Reports', obj:obj });
  
  });
});
/*
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
  }); */

module.exports = router;
