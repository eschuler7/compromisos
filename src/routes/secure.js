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
// Excel middleware
var Excel = require('exceljs');
// Loading path library
var path = require("path");

// TODAS LAS LLAMADAS GET
router.get('/dashboard',function(req, res){
	var ft = req.session.user.firsttime;
	if(ft == 1) {
		var dashboard = mysql.dashboard.getDashboardTypes();
		var commitment = mysql.commitment.getCommitmentTypes();
		var monitor = mysql.monitor.getMonitorTypes();
		res.render('partial/dashboard',{dashboard: dashboard, commitment: commitment, monitor: monitor});
	} else {
		res.render('partial/dashboard');
	}
});

router.get('/register',function(req, res){
	var commitment = mysql.commitment.getCommitmentTypes();
	var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
	res.render('partial/register',{commitment: commitment,commitmentconfig: commitmentconfig});
});

router.get('/select', function(req, res){
	res.render('partial/select');
});

router.get('/listall', function(req, res){
	var comconfig;
	try {
		comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
	} catch(e) {
		console.log('[/listall]',e);
	}
	res.render('partial/listall',{comconfig: comconfig});
});

router.get('/update', function(req, res){
	res.render('partial/update');
});

router.get('/home', function(req, res){
	res.render('partial/home');
});

router.get('/massive', function(req, res){
	res.render('partial/massive');
});

router.get('/configattrcommit', function(req, res){
	var commitment = mysql.commitment.getCommitmentTypes();
	var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
	res.render('partial/configattrcommit',{commitment: commitment,commitmentconfig: commitmentconfig});
});
router.get('/configattrmonit', function(req, res){
	var monitor = mysql.monitor.getMonitorTypes();
	var monitorconfig = mysql.monitor.getMonitConfigByRuc(req.session.user.t_company_ruc);
	res.render('partial/configattrmonit',{monitor: monitor,monitorconfig: monitorconfig});
});
router.get('/listallmonit', function(req, res){
	var monitconfig;
	try {
		monitconfig = mysql.monitor.getMonitConfigByRuc(req.session.user.t_company_ruc);
	} catch(e) {
		console.log('[/listallmonit]',e);
	}
	res.render('partial/listallmonit',{monitconfig: monitconfig});

});
router.get('/massivemonit', function(req, res){
	res.render('partial/massivemonit');
});
router.get('/registermonit', function(req, res){
	res.render('partial/registermonit');
});
router.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});

router.get('/template', function(req, res){
	try {
		var workbook = new Excel.Workbook();
		workbook.creator = 'SIGNEQ';
		var worksheet = workbook.addWorksheet('Compromisos');

		var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
		var columns = [];
		for (var i = 0; i < comconfig.length; i++) {
			var column = {
				header: comconfig[i].name,
				key: comconfig[i].t_commitment_config_id
			}
			columns.push(column);
		}
		worksheet.columns = columns;
		var downloadpath = path.resolve('downloads/' + req.session.user.t_company_ruc);
		var filename = 'plantilla.xlsx';
		var fullpath = downloadpath + '/' + filename;
		workbook.xlsx.writeFile(fullpath)
	    .then(function() {
	    	res.attachment(filename);
	        res.sendFile(fullpath);
	    });
	} catch(e) {
		console.log('[/listall]',e);
	}
});
router.get('/users', function(req, res){
	var users;
	try {
		users = mysql.user.getUsersByRuc(req.session.user.t_company_ruc);
	} catch(e) {
		console.log('[/users]',e);
	}
	res.render('partial/users', {users: users});
});
router.get('/userscreate', function(req, res){
	res.render('partial/userscreate');
});

// TODAS LAS LLAMADAS POST

router.post('/initConfig', function(req, res){
	var razonsocial = req.body.razonsocial;
	var unidadinit = req.body.unidadinit;
	var proyoper = req.body.proyoper;
	var multiunidad = req.body.multiunidad;
	var multiproyoper = req.body.multiproyoper;

	//sección dashboard
	var dashboard = req.body.dashboard;
	//sección compromisos
	var compromisos = req.body.compromisos;
	//sección monitoreo
	var monitoreo = req.body.monitoreo;
	try {
		var result = mysql.company.updateFirstTime(req.session.user.t_company_ruc);
		if(result.affectedRows == 1) {
			req.session.user.firsttime = 0;

			try{
				if(multiunidad=='Multiunidad')
					var unidadinit = 'Multiunidad';
				if(multiproyoper=='Multiproyecto')
					var proyoper = 'Multiproyecto';
				console.log('resultado de unidadinit: ',unidadinit);
				console.log('Insertando Headers: ');
				mysql.company.updateCompanyByRuc(req.session.user.t_company_ruc,razonsocial,unidadinit,proyoper);
				console.log('Insertando dashboard: ');
				mysql.dashboard.updateDashboardConfig(req.session.user.t_company_ruc,dashboard);
				console.log('Insertando compromisos: ');
				mysql.commitment.updateCommitmentConfig(req.session.user.t_company_ruc,compromisos);	
				console.log('Insertando monitoreo: ');
				mysql.monitor.updateMonitorConfig(req.session.user.t_company_ruc,monitoreo);	

			}catch(e) {
				console.log('[/initConfig]',e);
			}
			res.redirect('/secure/dashboard');
		}
	} catch(e) {
		console.log('[/initConfig]',e);
	}
});

router.post('/configattrcommit', function(req, res){
	try {

		//sección compromisos
		var compromisos = req.body.compromisos;
		console.log('resultado de compromisos: ',compromisos);
		//sección etapascompromiso
		var etapascompromiso = req.body.etapascompromiso;
		console.log('resultado de etapascompromiso: ',etapascompromiso);
		//sección Eliminar data
		var result = mysql.commitment.deleteCommitmentTypes(req.session.user.t_company_ruc);
		
		console.log('Insertando compromisos: ');
		mysql.commitment.updateCommitmentConfig(req.session.user.t_company_ruc,compromisos);	

		res.redirect('/secure/configattrcommit');
		
	} catch(e) {
		console.log('[/configattrcommit]',e);
	}
});

router.post('/configattrmonit', function(req, res){
	try {

		var monitoreo = req.body.monitoreo;
		console.log('resultado de monitoreo: ',monitoreo);
		//sección etapasmonitoreo
		var etapasmonitoreo = req.body.etapasmonitoreo;
		console.log('resultado de etapasmonitoreo: ',etapasmonitoreo);
		//sección Eliminar data
		var result = mysql.monitor.deleteMonitorTypes(req.session.user.t_company_ruc);
		
		console.log('Insertando monitoreo: ');
		mysql.monitor.updateMonitorConfig(req.session.user.t_company_ruc,monitoreo);		

		res.redirect('/secure/configattrmonit');
		
	} catch(e) {
		console.log('[/configattrmonit]',e);
	}
});

router.post('/userscreate', function(req, res){
	var userid = req.body.userid;
	var email = req.body.email;
	var name = req.body.name;
	var rol = req.body.rol;
	var lastname = req.body.lastname;
	var password = req.body.password;

	console.log(userid,email,name,lastname,rol);

	try {
		// Registering information
		mysql.user.createUser(userid, computil.createHash(config().checksumhash,password), email, name, lastname, req.session.user.t_company_ruc, rol, 1);
		
		var htmlRegistrationTemplate = computil.loadEmailTemplate('security_newuser');
		if(htmlRegistrationTemplate == '') {
			console.log('[/userscreate]','[util email template]','La plantilla de correo no pudo ser cargada.');
		} else {
			htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$COMPANY_NAME',req.session.user.companyname);
			htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$BASE_URL',config().baseUrl);
			htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$USERID',userid);
			htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$PASSWORD',password);
			compemail.sendEmail(email,'Registro en NOLAN',htmlRegistrationTemplate);
		}
	} catch(e) {
		console.log(e);
		mysql.user.deleteUserById(req.session.user.t_company_ruc, userid);
	}

	res.redirect('/secure/users');
});

router.post('/deleteUser', function(req, res){
	var userid = req.body.userid;
	try {
		var result = mysql.user.deleteUserById(req.session.user.t_company_ruc,userid);
	} catch(e) {
		console.log('[/secure/deleteUser]','[rollback user]',e);
	}
	res.redirect('/secure/users');
});
module.exports = router;