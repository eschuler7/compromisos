'use strict';
// Loading express router
var express = require('express');
var router = express.Router();

// Loading mysql library
var mysql = require('../lib/mysql');

// Loading util library
var util = require('../lib/util');

//Loading Email Library
var c_email = require('../lib/email');

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

router.get('/prueba', function(req,res){
	res.render('msg');
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
	// Company Information
	var ruc = req.body.ruc;
	var companyname = req.body.companyname;
	var email = req.body.email;

	// User information
	var userid = req.body.userid;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var password = req.body.password;

	try {
		// Registering company information
		var result = mysql.company.createCompany(ruc, companyname, email);
		if(result.affectedRows == 1) {
			// Registering user information
			var initRol = 'ROL1';
			mysql.user.createUser(userid, password, firstname, lastname, ruc, initRol);
			c_email.sendEmail(email,'Registro Satisfactorio','El registro en mis compromisos ha sido satisfactorio. Muchas Gracias.');
			res.render('msg');
		} else {
			res.render('error');
		}
	} catch(e) {
		console.log(e);
		res.render('error');
	}
});

module.exports = router;