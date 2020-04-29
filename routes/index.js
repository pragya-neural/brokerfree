var express = require('express');
var router = express.Router();
var app = express();
const { check, validationResult } = require('express-validator');
var Cryptr  = require('cryptr');
var md5 = require('md5');
var connection = require('./connection');
var crud_module = require('./crud_module');
var checkLogin = function (req, res, next) {
  if (!req.session.loggedin) {
		next();
	} else {
		res.redirect("/property");
	}
}
//check email address
var checkemail = function (req, res, next) {
  var email = req.body.USEREMAIL;
  var where = "email_id='"+email+"'";
  crud_module.num_rows('users',where,function(tcount){
    if(tcount==0){
      next(); 
    }
    else{
      res.send('email_error');
    }
  });
}
//check mobile
var checkmobile = function (req, res, next) {
  var mob = req.body.mobile;
  var where = "user_login='"+mob+"'";
  crud_module.num_rows('users',where,function(tcount){
    if(tcount==0){
      next(); 
    }
    else{
      res.send('mob_error');
    }
  });
}

app.use(checkLogin);
/* GET home page. */
router.get('/',checkLogin, function(req, res, next) {
  res.render('index', { title: 'Nobrokerr' });
});
// check email address
router.post('/email-ajax-check',[checkemail,checkmobile],function(req, res, next) {
  res.send('success');
});

/* POST register page. */
router.post('/register', function(req, res, next) {
  var today = new Date();
  var encryptedString = md5(req.body.password1);
  var username = req.body.mobileno;
  var users={
    "creation_date":today,
    "user_login":req.body.mobileno,
    "user_pwd":encryptedString,
    "name":req.body.username,
    "email_id":req.body.email2,
    "mobile_no":req.body.mobileno,
    "user_type":"registered"
}
  connection.query('INSERT INTO users SET ?',users, function (err, results, fields) { 
    if (err) throw err;
	var insert_id = results['insertId'];
	if (insert_id > 0) {
		req.session.loggedin = true;
		req.session.username = username;
		req.session.uid = insert_id;
		req.session.name = req.body.username;
		res.redirect('/verification');
	}
});
  
});

router.post('/auth', function(request, response) {
	var username = request.body.mobileno2;
	var password = md5(request.body.password);
	if (username && password) {
		connection.query('SELECT * FROM users WHERE user_login = ? AND user_pwd = ? and active_status= "active"', [username, password], function(error, results, fields) { if(error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.uid = results[0].user_id;
				request.session.name = results[0].name;
        //response.redirect('/property');
        response.send('login');
        response.end();
			} else {
        response.send('Incorrect Username and/or Password!');
        response.end();
			}			
			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.get('/admin', function(req, res, next) {
  res.render('admin/index.ejs', { title:'Nobrokerr Admin Panel' ,exits:''});
});

router.get('/post-property', function(req, res, next) {
  res.render('post-property', { title:'Post Property' ,exits:''});
});

router.get('/tenant-plan', function(req, res, next) {
	res.render('tenant-plan', { title:'Post Property '});
  });

  router.get('/owner-plan', function(req, res, next) {
	res.render('owner-plan', { title:'Post Property '});
  });

  router.get('/agreement', function(req, res, next) {
	res.render('agreement', { title:'Post Property '});
  });

  router.get('/corporate', function(req, res, next) {
	res.render('corporate', { title:'Post Property '});
  });

  router.get('/builder', function(req, res, next) {
    res.render('builder', { title:'Post Property '});
    });


  router.get('/seller-plan', function(req, res, next) {
	res.render('seller-plan', { title:'Post Property '});
  });

  router.get('/buyer-plan', function(req, res, next) {
	res.render('buyer-plan', { title:'Post Property '});
  });
  
router.get('/logout', function(req, res, next) {
	req.session.loggedin = false;
		req.session.destroy();
		res.redirect('/');
});

/* POST post-property page. */
router.post('/post-property',[
  check('uname','Enter full user name.').isLength({ min: 3 }),
  check('email','email Enter valid email id.').isEmail(),
  check('password', 'Enter valid password.').isLength({ min: 5 }),
  check('mobileno','Mobile length must be 10.').isLength({min: 10, max: 14})
], function(req, res, next) {
  
  var errors = validationResult(req);
  //var errors = res.errors;
  
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    let arrayErros = errors.mapped()
    let mensagens = arrayErros
    console.log('this msg:' + mensagens.uname);
    res.render('post-property', { title:'Post Property ', errors: mensagens,exits:''});
  } else
  {
    var today = new Date();
    var encryptedString = md5(req.body.password);

    var users={
      "creation_date":today,
      "user_login":req.body.mobileno,
      "user_pwd":encryptedString,
      "name":req.body.uname,
      "email_id":req.body.email,
      "mobile_no":req.body.mobileno,
      "user_type":"registered"
        }
	var exits = "select count('user_id') as cnt from users where email_id='"+req.body.email+"' and user_login='"+req.body.mobileno+"'";
	connection.query(exits, function (err, exitresults, fields) {
    if (err) throw err;
	if(exitresults[0].cnt>0){
	res.render('post-property', { title:'Post Property ', exits: 'Already Exits.'});
	return false;	
	}
	else{
	connection.query('INSERT INTO users SET ?',users, function (err, results, fields) {
      if (err) throw err; 
	  var insert_id = results['insertId'];
		req.session.loggedin = true;
		req.session.username = req.body.mobileno;
		req.session.uid = insert_id;
		res.redirect("/verification");
    });	
	}
    });
  }
});

router.get('/verification', function(req, res, next) {
  res.render('verification', { title:'Post Property' ,exits:''});
});

router.get('/propertysaved', function(req, res, next) {
	res.render('propertysaved', { title:'Post Property ', sideselection: 'property'});
  });

router.get('/dashboard', function(req, res, next) {
	res.render('dashboard', { title:'Post Property ', sideselection: 'dashboard'});
  });

router.get('/my-profile', function(req, res, next) {
	res.render('my-profile', { title:'Post Property ', sideselection: 'my-profile'});
  });

router.get('/my-property', function(req, res, next) {
	res.render('my-property', { title:'Post Property ', sideselection: 'my-properties'});
  });

router.get('/existing-residential-plan', function(req, res, next) {
	res.render('existing-residential-plan', { title:'Post Property ', sideselection: 'existing-residential-plan'});
  });

router.get('/residential-tenant', function(req, res, next) {
	res.render('residential-tenant', { title:'Post Property ', sideselection: 'residential-tenant'});
  });

router.get('/residential-owner', function(req, res, next) {
	res.render('residential-owner', { title:'Post Property ', sideselection: 'residential-owner'});
  });

router.get('/residential-seller', function(req, res, next) {
	res.render('residential-seller', { title:'Post Property ', sideselection: 'residential-seller'});
  });

router.get('/residential-buyer', function(req, res, next) {
	res.render('residential-buyer', { title:'Post Property ', sideselection: 'residential-buyer'});
  });

router.get('/existing-commercial-plan', function(req, res, next) {
	res.render('existing-commercial-plan', { title:'Post Property ', sideselection: 'existing-commercial-plan'});
  });

router.get('/commercial-tenant', function(req, res, next) {
	res.render('commercial-tenant', { title:'Post Property ', sideselection: 'commercial-tenant'});
  });

router.get('/commercial-owner', function(req, res, next) {
	res.render('commercial-owner', { title:'Post Property ', sideselection: 'commercial-owner'});
  });

router.get('/commercial-seller', function(req, res, next) {
	res.render('commercial-seller', { title:'Post Property ', sideselection: 'commercial-seller'});
  });

router.get('/commercial-buyer', function(req, res, next) {
	res.render('commercial-buyer', { title:'Post Property ', sideselection: 'commercial-buyer'});
  });

module.exports = router;
