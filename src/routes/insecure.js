'use strict';
// Loading express router
var express = require('express');
var router = express.Router();

<<<<<<< HEAD
// Loading mysql library
var mysql = require('../lib/mysql');
=======
>>>>>>> e43ca0fa51ac8fe1e56781cd31902e38731d5d5b

// TODOS LOS GET
router.get('/',function(req, res){
	res.render('login');
});

router.get('/signup', function(req, res){
	res.render('signup');
});

router.get('/resetpwd', function(req, res){
	res.render('resetpwd');
});

// TODOS LOS POST
router.post('/login',function(req, res){
	var ruc = req.body.ruc;
	var userid = req.body.userid;
	var password = req.body.password;
	console.log(ruc,userid,password);
	res.render('partial/dashboard');
});

router.post('/resetpwd',function(req, res){
	var ruc = req.body.ruc;
	var email = req.body.email;
	console.log(ruc,email);
	res.end();
});

router.post('/signup',function(req, res){
	var ruc = req.body.ruc;
	var companyname = req.body.companyname;
	var email = req.body.email;
	var userid = req.body.userid;
	var password = req.body.password;

	try {
		mysql.company.createCompany(ruc, companyname, email);
	} catch(e) {
		console.log(e);
	}
	
	res.end();
});

module.exports = router;