'use strict';
// Loading express router
var express = require('express');
var router = express.Router();

// Loading mysql library
var mysql = require('../lib/mysql');

// Loading util library
var computil = require('../lib/computil');

//Loading Email Library
var compemail = require('../lib/email');

//Loading Config
var config = require('../lib/config');

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
	var email = req.body.email;
	var password = req.body.password;
	
	try {
		var userlist = mysql.user.login(email, computil.createHash(config().checksumhash,password));
		if(userlist.length == 1) {
			req.session.user = userlist[0];
			res.redirect('/secure/home');
		} else {
			res.render('login', {error : 'Los datos ingresados no son correctos.'});
		}
	} catch(e) {
		console.log('[POST]','[/login]',e);
		res.render('login', {error : 'Hubo un error en el inicio de sesión, por favor intente nuevamente.'});
	}
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
			mysql.user.createUser(userid, computil.createHash(config().checksumhash,password), firstname, lastname, ruc, initRol);
			// Sending confirmation email
			var htmlRegistrationTemplate = computil.loadEmailTemplate('security_registration');
			if(htmlRegistrationTemplate == '') {
				console.log('[/signup]','[util email template]','La plantilla de correo no pudo ser cargada.');
			} else {
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$COMPANY_NAME',companyname);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$BASE_URL',config().baseUrl);
				compemail.sendEmail(email,'Registro en Mis Compromisos',htmlRegistrationTemplate);
			}
			res.render('msg');
		} else {
			res.render('error');
		}
	} catch(e) {
		console.log('[/signup]',e);
		try {
			mysql.company.deleteCompanyByRuc(ruc);
		} catch(e) {
			console.log('[/signup]','[rollback company]',e);
		}

		res.render('error');
	}
});

module.exports = router;