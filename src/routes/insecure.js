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
	var userid = req.body.userid;
	var password = req.body.password;
	
	try {
		var userlist = mysql.user.login(userid, computil.createHash(config().checksumhash,password));
		if(userlist.length == 1) {
			if (userlist[0].changepwd == 1) {
				res.render('changepwd',{userid:userid});
			} else {
				req.session.user = userlist[0];
				if(userlist[0].t_rol_rolid == 'ROL5') {
					res.redirect('/admin/clients');
				} else {
					res.redirect('/secure/dashboard');
				}
			}
		} else {
			res.render('login', {error : 'Los datos ingresados no son correctos.'});
		}
	} catch(e) {
		console.log('[POST]','[/login]',e);
		res.render('login', {error : 'Hubo un error en el inicio de sesión, por favor intente nuevamente.'});
	}
});
router.post('/changepwd',function(req, res){
	var userid = req.body.userid;
	var password = req.body.password;
	var newpassword = req.body.newpassword;

	try {
		var result = mysql.user.resetPassword(userid, computil.createHash(config().checksumhash,password), computil.createHash(config().checksumhash,newpassword));
		if(result.affectedRows == 1) {
			res.render('msg',{msg:{title:'¡ Cambio de contraseña exitoso !', body:'El cambio de contraseña fue satisfactorio, por favor inicie sesión con sus nuevos datos.'}});
		} else {
			res.render('error',{err:{title:'Error',body:'Los datos ingresados no pudieron ser validados correctamente, por favor intentelo nuevamente.'}});
		}
	} catch(e) {
		console.log('[POST]','[/changepwd]',e);
		res.render('error',{err:{title:'Error',body:'Se produjo un error durante el cambio de contraseña, por favor intente nuevamente en unos minutos.'}});
	}
});

router.post('/resetpwd',function(req, res){
	var userid = req.body.userid;
	try {
		// Registering company information
		var result = mysql.user.validateUserId(userid);
		if(result.length == 1) {
			// Registering user information
			var password = computil.randomCode(8);
			var resultforgot = mysql.user.resetForgotPassword(req.body.userid, computil.createHash(config().checksumhash,password));
			
			if (resultforgot.affectedRows == 1) {
				// Sending confirmation email
				var emailTO = mysql.user.getEmailByID(userid);
				console.log(req.body.userid,emailTO);
				var htmlRegistrationTemplate = computil.loadEmailTemplate('security_forgotPassword');
				if(htmlRegistrationTemplate == '') {
					console.log('[/resetpwd]','[util email template]','La plantilla de correo no pudo ser cargada.');
				} else {
					htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$USERID',userid);
					htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$PASSWORD',password);
					htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$BASE_URL',config().baseUrl);
					compemail.sendEmail(emailTO[0].email,'Cambio de contreña en NOLAN',htmlRegistrationTemplate);
					res.render('msg',{msg:{title:'¡ Cambio de contraseña exitoso !', body:'El cambio de contraseña fue satisfactorio, por favor inicie sesión con sus nuevos datos.'}});
				}
				
			} else {
				res.render('error',{err:{title:'Error',body:'Se produjo un error durante el cambio de contraseña, por favor intente nuevamente en unos minutos.'}});

			}
		} else {
			res.render('error',{err:{title:'Error',body:'Usuario no se encuentra registrado'}});

		}
	} catch(e) {
		console.log('[POST]','[/resetpwd]',e);
		res.render('error',{err:{title:'Error',body:'Se produjo un error durante el cambio de contraseña, por favor intente nuevamente en unos minutos.'}});
	}
	
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