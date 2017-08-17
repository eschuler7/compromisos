'use strict';

// Loading express router
var express = require('express');
var router = express.Router();
// Loading mysql library
var mysql = require('../lib/mysql');
// Loading util library
var computil = require('../lib/computil');
// Loading Config
var config = require('../lib/config');
// Loading Email Library
var compemail = require('../lib/email');
// Loading file system handling middlewares
var fs = require('fs');
var path = require("path");

// TODAS LAS LLAMADAS GET

router.get('/clients', function(req, res){
	var companies;
	try {
		companies = mysql.company.listCompanies(req.session.user.t_company_ruc);
	} catch(e) {
		console.log('[/clients]',e);
	}
	res.render('partial/admin/clients',{clients: companies});
});
router.get('/clientdetail/:ruc', function(req, res){
	var ruc = req.params.ruc;
	try {
		var client = mysql.company.getCompanyByRuc(ruc);
		var users = mysql.user.getUsersByRuc(ruc);
		res.render('partial/admin/clientdetail',{client:client[0],users:users});
	} catch(e) {
		console.log('[/clientdetail]',e);
	}
});
router.get('/createclient', function(req, res){
	res.render('partial/admin/clientcreate');
});
router.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});


// TODAS LAS LLAMADAS POST
router.post('/create',function(req, res){
	var ruc = req.body.ruc;
	var companyname = req.body.companyname;
	var userid = req.body.userid;
	var email = req.body.email;
	var name = req.body.name;
	var lastname = req.body.lastname;
	var password = req.body.password;

	console.log(ruc,companyname);

	try {
		// Registering company information
		var result = mysql.company.createCompany(ruc, companyname);
		if(result.affectedRows == 1) {
			// Registering user information
			mysql.user.createUser(userid, computil.createHash(config().checksumhash,password), email, name, lastname, ruc, 'ROL1', 1);
			// Init Dashboard Configuration
			//mysql.dashboard.updateDashboardConfig(ruc);
			// Init Commitment Configuration
			//mysql.commitment.updateCommitmentConfig(ruc);
			// Init Monitor Configuration
			//mysql.monitor.updateMonitorConfig(ruc);
			// Creating upload and download folders
			var downloadpath = path.resolve('downloads') + '/' + ruc;
			fs.mkdir(downloadpath, mask, function(err) {
		        if (err) {
		            console.log(err);
		        }
		    });
			var uploadpath = path.resolve('uploads') + '/' + ruc;
			fs.mkdir(uploadpath, mask, function(err) {
		        if (err) {
		            console.log(err);
		        }
		    });

			// Sending confirmation email
			var htmlRegistrationTemplate = computil.loadEmailTemplate('security_registration');
			if(htmlRegistrationTemplate == '') {
				console.log('[/signup]','[util email template]','La plantilla de correo no pudo ser cargada.');
			} else {
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$COMPANY_NAME',companyname);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$BASE_URL',config().baseUrl);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$USERID',userid);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$PASSWORD',password);
				compemail.sendEmail(email,'Registro en Mis Compromisos',htmlRegistrationTemplate);
			}
		}
	} catch(e) {
		console.log('[/admin/create]',e);
		try {
			mysql.company.deleteCompanyByRuc(ruc);
		} catch(e) {
			console.log('[/admin/create]','[rollback company]',e);
		}
	}
	res.redirect('/admin/clients');
});
router.post('/deleteclient', function(req, res){
	var ruc = req.body.ruc;
	try {
		var result = mysql.company.deleteCompanyByRuc(ruc);
	} catch(e) {
		console.log('[/admin/deletecompany]','[rollback company]',e);
	}
	res.redirect('/admin/clients');
});
//Ajax call
router.post('/validateruc', function(req, res){
	var ruc = req.body.ruc;
	try {
		var result = mysql.company.validateRuc(ruc);
		if(result.length > 0) {
			res.send(false);
		} else {
			res.send(true);
		}
	} catch(e) {
		console.log('[/validateruc]',e);
		res.send(true);
	}
});
// Ajax call
router.post('/validateuserid', function(req, res){
	var userid = req.body.userid;
	try {
		var result = mysql.user.validateUserId(userid);
		if(result.length > 0) {
			res.send(false);
		} else {
			res.send(true);
		}
	} catch(e) {
		console.log('[/validateemail]',e);
		res.send(true);
	}
});
router.post('/pruebita', function(req, res){
	var pruebita = req.body.prueba;
	console.log(pruebita);
	res.end();
});
module.exports = router;