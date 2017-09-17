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
  saveUninitialized: true
}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// Session Filter
app.all('/secure/*',function(req,res,next){
	if(req.session.user){
		if(req.session.user.t_rol_rolid == 'ROL5'){
			res.redirect('/admin/clients');
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
			res.redirect('/admin/clients');
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

// Client routes
var insecure = require('./routes/insecure');
app.use('/', insecure);
var secure = require('./routes/secure');
app.use('/secure', secure);
var admin = require('./routes/admin');
app.use('/admin', admin);

// Middleware de Auditoría
var mysql = require('./lib/mysql');
var dateFormat = require('dateformat');
app.use(function(req, res){
	var date = dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss');
	var originalUrl = req.originalUrl.split('/');
	originalUrl.splice(0,1);
	var router = originalUrl.length == 1 ? 'insecure' : originalUrl[0];
	var action = originalUrl.length == 1 ? originalUrl[0] : originalUrl[1];
	var sessionid = req.sessionID;
	var ruc;
	var companyname;
	var userid;
	if(req.session) {
		ruc = req.session.user.t_company_ruc;
		companyname = req.session.user.companyname;
		userid = req.session.user.userid;
	} else {
		ruc = req.ruc;
		companyname = req.companyname;
		userid = req.userid;
	}
	mysql.auditlog.registerAuditLog(date, ruc, companyname, sessionid, userid, router, action);
});

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
var objectstorage = require('./lib/objectstorage');
app.listen(app.get('port'), '0.0.0.0', function() {
	console.log('Node.Js Server iniciado en el puerto:',app.get('port'));
	console.log('Node JS Version:', process.version);
});