var express = require('express');
var router = express.Router();
var app = express();
var curd_module = require('./crud_module');

router.get('/home', checkLogin,function(req, res, next) {
    res.render('admin/home', { title: 'Nobroker Admin-Panel'});
  });

  

module.exports = router;
