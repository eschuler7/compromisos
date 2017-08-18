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

// Starting NodeJS Server
// Excel middleware
var Excel = require('exceljs');
// Loading path library
var path = require('path');
// Loading mysql library
var mysql = require('./lib/mysql');
app.listen(app.get('port'), '0.0.0.0', function() {
	console.log('Node.Js Server iniciado en el puerto ' + app.get('port'));
	var workbook = new Excel.Workbook();
	workbook.creator = 'SIGNEQ';
	var worksheet = workbook.addWorksheet('Compromisos');

	var comconfig = mysql.commitment.getComConfigByRuc('12345678908');
	worksheet.mergeCells(1,1,1,comconfig.length);
	worksheet.getCell('A1').value = 'Matriz Integrada de Compromisos de la Unidad de Mi Unidad';
	var row = [];
	for (var i = 0; i < comconfig.length; i++) {
		row.push(comconfig[i].name);
		worksheet.getColumn(i + 1).width = 20;
	}
	worksheet.addRow(row);

	worksheet.eachRow(function(row, rowNumber) {
	    row.eachCell(function(cell, colNumber) {
		    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
		    cell.border = {
			    top: {style:'medium'},
			    left: {style:'medium'},
			    bottom: {style:'medium'},
			    right: {style:'medium'}
			};
		});
	});

	var downloadpath = path.resolve('downloads/12345678908');
	var filename = 'plantilla.xlsx';
	var fullpath = downloadpath + '/' + filename;
	workbook.xlsx.writeFile(fullpath)
    .then(function() {
    	console.log('archiv creado');
    });
});