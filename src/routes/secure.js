'use strict';

// Loading express router
var express = require('express');
var router = express.Router();

router.get('/dashboard',function(req, res){
	res.render('partial/dashboard');
});

router.get('/register',function(req, res){
	res.render('partial/register');
});

router.get('/select', function(req, res){
	res.render('partial/select');
});

router.get('/update', function(req, res){
	res.render('partial/update');
});

router.get('/massive', function(req, res){
	res.render('partial/massive');
});

module.exports = router;