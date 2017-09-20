'use strict';

// Loading dependencies
var express = require('express');

// Initilizing express application
var app = express();

//Loading Config
var config = require('./lib/config');

// Body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Handle
var session = require('express-session');
app.use(session({
  secret: '1qwe34rsc87yh',
  resave: false,
  saveUninitialized: false,
  cookie: {
  	maxAge: 1800000
  	//maxAge: 60000
  }
}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// Session Filter
app.all('/secure/*',function(req,res,next){
	if(req.session.user){
		if(req.session.user.t_rol_rolid == 'ROL5'){
			res.redirect('/admin/clientlist');
		} else {
			if(req.method == 'GET' && req.params[0] != 'dashboard' && req.params[0] != 'logout' && req.session.user.firsttime == 1) {
				res.redirect('/secure/dashboard');
			} else {
				next();
			}
		}
	} else {
		req.session.destroy();
		res.redirect('/');
	}
});

app.all('/admin/*',function(req,res,next){
	if(req.session.user){
		if(req.session.user.t_rol_rolid == 'ROL5'){
			next();
		} else {
			res.redirect('/secure/dashboard');
		}
	} else {
		req.session.destroy();
		res.redirect('/');
	}
});

app.all('/', function(req, res, next){
	if(req.session.user){
		if(req.session.user.t_rol_rolid == 'ROL5'){
			res.redirect('/admin/clientlist');
		} else {
			res.redirect('/secure/dashboard');
		}
	} else {
		next();
	}
});

// View engine setup
app.set('view engine', config().views.engine);
app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Initialization port
app.set('port', process.env.PORT || config().port);

// Middleware to handle admin notifications
app.use(['/admin','/secure'],function(req, res, next) {
	var notification = 'none';
	if (req.session.notification) {
		notification = req.session.notification;
		delete req.session.notification;
	}
	req.notification = notification;
	next();
});

// Client routes
var insecure = require('./routes/insecure');
app.use('/', insecure);
var secure = require('./routes/secure');
app.use('/secure', secure);
var admin = require('./routes/admin');
app.use('/admin', admin);

// Midleware custom error handler
app.use(function(err, req, res, next){
	console.log('[ERROR]','[' + req.originalUrl + ']','[' + req.method + ']','[Ajax:' + req.xhr + ']',err);
	if(req.xhr) {
		res.send('error');
	} else {
		res.render('partial/handlers/error');
	}
});

// Starting NodeJS Server
app.listen(app.get('port'), '0.0.0.0', function() {
	console.log('Node.Js Server iniciado en el puerto:',app.get('port'));
	console.log('Node JS Version:', process.version);
});