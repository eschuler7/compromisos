'use strict';

// Loading express router
var express = require('express');
var router = express.Router();
// Loading mysql library
var mysql = require('../lib/mysql');

// TODAS LAS LLAMADAS GET
router.get('/dashboard',function(req, res){
	res.render('partial/dashboard');
});

router.get('/register',function(req, res){
	res.render('partial/register');
});

router.get('/select', function(req, res){
	res.render('partial/select');
});

router.get('/listall', function(req, res){
	res.render('partial/listall');
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
	res.render('partial/configattrcommit');
});
router.get('/configattrmonit', function(req, res){
	res.render('partial/configattrmonit');
});
router.get('/listallmonit', function(req, res){
	res.render('partial/listallmonit');
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

// TODAS LAS LLAMADAS POST

router.post('/initConfig', function(req, res){
	try {
		var result = mysql.company.updateFirstTime(req.session.user.t_company_ruc);
		if(result.affectedRows == 1) {
			req.session.user.firsttime == 0;
		}
	} catch(e) {
		console.log('[/initConfig]',e);
	}
	res.redirect('/secure/home');
});

module.exports = router;