var express = require('express');
var router = express.Router();
var app = express();
var curd_module = require('./curd_module');

router.get('/home', function(req, res, next) {
    res.render('admin/home', { title: 'Nobroker Admin-Panel'});
  });



module.exports = router;
