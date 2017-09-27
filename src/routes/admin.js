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
// Loading Object Storage Library
var objectstorage = require('../lib/objectstorage');
// Loading file system handling middlewares
var fs = require('fs');
var path = require("path");
//Audit Log
var auditlog = require('../lib/auditlog');

// TODAS LAS LLAMADAS GET
router.get('/clientlist', function(req, res){
	var companies = mysql.company.listCompanies(req.session.user.t_company_ruc);
	res.render('partial/admin/clientlist',{clients: companies, notification: req.notification});
});
router.get('/clientdetail/:ruc', function(req, res){
	var ruc = req.params.ruc;
	var client = mysql.company.getCompanyByRuc(ruc);
	var users = mysql.user.getUsersByRuc(ruc);
	res.render('partial/admin/clientdetail',{client:client[0],users:users, notification: req.notification});
});
router.get('/clientcreate', function(req, res){
	res.render('partial/admin/clientcreate',{notification: req.notification});
});
router.get('/logout', function(req, res){
	req.ruc = req.session.user.t_company_ruc;
	req.companyname = req.session.user.companyname;
	req.userid = req.session.user.userid;
	req.session.destroy();
	res.redirect('/');
	auditlog(req);
});
router.get('/auditlogs', function(req, res){
	var auditlogs = mysql.auditlog.getAuditLogs();
	res.render('partial/admin/auditlog',{auditlogs: auditlogs,notification: req.notification});
});
router.get('/platformconfig', function(req, res){
	res.render('partial/admin/platformconfig',{notification: req.notification});
});


// TODAS LAS LLAMADAS POST
router.post('/clientcreate',function(req, res, next){
	var ruc = req.body.ruc;
	req.idaffected = ruc; // Para auditoría
	var companyname = req.body.companyname;
	var userid = req.body.userid;
	var email = req.body.email;
	var name = req.body.name;
	var lastname = req.body.lastname;
	var password = req.body.password;

	try {
		// Registering company information
		var result = mysql.company.createCompany(ruc, companyname);
		if(result.affectedRows == 1) {
			// Registering user information
			mysql.user.createUser(userid, computil.createHash(config().checksumhash,password), email, name, lastname, ruc, 'ROL1', 1);
			// Init Dashboard Configuration
			var initDashboardConfig = ['DB01'];
			mysql.dashboard.updateDashboardConfig(ruc,initDashboardConfig);
			// Init Commitment Configuration
			var initCommitmentConfig = ['CM01','CM03','CM12','CM13','CM14','CM15','CM18'];
			mysql.commitment.updateCommitmentConfig(ruc,initCommitmentConfig);
			// Init Monitor Configuration
			var initMonitorConfig = ['MN01'];
			mysql.monitor.updateMonitorConfig(ruc,initMonitorConfig);
			// Creating upload and download folders
			var downloadpath = path.resolve('downloads') + '/' + ruc;
			fs.mkdir(downloadpath, function(err) {
		        if (err) {
		            console.log(err);
		        }
		    });
			var uploadpath = path.resolve('uploads') + '/' + ruc;
			fs.mkdir(uploadpath, function(err) {
		        if (err) {
		            console.log(err);
		        }
		    });
		    // Creating object storage
		    objectstorage.container.createContainer(ruc);

			// Sending confirmation email
			var htmlRegistrationTemplate = computil.loadEmailTemplate('security_registration');
			if(htmlRegistrationTemplate == '') {
				console.log('[/signup]','[util email template]','La plantilla de correo no pudo ser cargada.');
			} else {
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$COMPANY_NAME',companyname);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$BASE_URL',config().baseUrl);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$USERID',userid);
				htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$PASSWORD',password);
				compemail.sendEmail(email,'Registro en NOLAN',htmlRegistrationTemplate);
			}
			req.session.notification = computil.notification('success','Registro Satisfactorio','El cliente ha sido creado satisfactoriamente.');
			res.redirect('/admin/clientlist');
			auditlog(req);
		} else {
			req.session.notification = computil.notification('error','Error de Registro','El cliente no pudo ser creado, por favor verifique los datos e intente nuevamente.');
			res.redirect('/admin/clientlist');
		}
	} catch(e) {
		mysql.company.deleteCompanyByRuc(ruc);
		next(e);
	}
});
router.post('/clientdelete', function(req, res){
	var ruc = req.body.ruc;
	req.idaffected = ruc; // Para auditoría
	var result = mysql.company.deleteCompanyByRuc(ruc);
	// Destroying object storage
	objectstorage.container.destroyContainer(ruc);
	res.redirect('/admin/clientlist');
	auditlog(req);
});

//Ajax call
router.post('/validateruc', function(req, res){
	var ruc = req.body.ruc;
	var result = mysql.company.validateRuc(ruc);
	if(result.length > 0) {
		res.send(false);
	} else {
		res.send(true);
	}
});
// Ajax call
router.post('/validateuserid', function(req, res){
	var userid = req.body.userid;
	var result = mysql.user.validateUserId(userid);
	if(result.length > 0) {
		res.send(false);
	} else {
		res.send(true);
	}
});
module.exports = router;