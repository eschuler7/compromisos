'use strict';

// Loading dependencies
var express = require('express');

// Initilizing express application
var app = express();

//Loading Config
var config = require('./lib/config');

// View engine setup
app.set('view engine', config().views.engine);
app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Initialization port
app.set('port', process.env.PORT || config().port);

app.get('/', function(req, res){
  res.render('login');
});

app.get('/dashboard', function(req, res){
  res.render('partial/dashboard');
});

app.post('/login', function(req, res){
  res.render('partial/home');
});

app.get('/register', function(req, res){
  res.render('partial/register');
});

app.get('/update', function(req, res){
  res.render('partial/update');
});

app.get('/select', function(req, res){
  res.render('partial/select');
});

app.get('/massive', function(req, res){
  res.render('partial/massive');
});

// Starting NodeJS Server
app.listen(app.get('port'), '0.0.0.0', function() {
	console.log('Node.Js Server iniciado en el puerto ' + app.get('port'));
});