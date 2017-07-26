'use strict';

// Loading express router
var express = require('express');
var router = express.Router();

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

router.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});

// TODAS LAS LLAMADAS POST

module.exports = router;