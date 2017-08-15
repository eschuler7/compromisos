'use strict';

// Loading express router
var express = require('express');
var router = express.Router();
// Loading mysql library
var mysql = require('../lib/mysql');

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
	res.render('partial/register');
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
module.exports = router;