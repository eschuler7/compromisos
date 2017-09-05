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
var path = require('path');
// Loading multer to storage files
var multer  = require('multer');
// Format dates to custom string formats
var dateFormat = require('dateformat');
// Loading Object Storage Library
var objectstorage = require('../lib/objectstorage');

// Configuring upload disk storage
var uploadsComStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var ruc = req.session.user.t_company_ruc;
    cb(null, path.resolve('uploads/' + ruc));
  },
  filename: function (req, file, cb) {
    var userid = req.session.user.userid;
    cb(null, userid + '-commitment-template.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});
var udploadComTemplate = multer({ storage: uploadsComStorage });
var uploadsMonStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var ruc = req.session.user.t_company_ruc;
    cb(null, path.resolve('uploads/' + ruc));
  },
  filename: function (req, file, cb) {
    var userid = req.session.user.userid;
    cb(null, userid + '-monitor-template.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});
var udploadMonTemplate = multer({ storage: uploadsMonStorage });

// Configuring upload cloud object storage
var uploadEvidences = multer({storage: objectstorage.getMulterObjectStorage});

// TODAS LAS LLAMADAS GET
//////////////////////////////////////// PRUEBAS ///////////////////////////////////////
// Loading fs library
var fs = require('fs');
router.get('/prueba', function(req, res){
    var files = objectstorage.file.getFiles(req.session.user.t_company_ruc);
    console.log(files);
    res.render('partial/commitment/prueba');
});
router.post('/upload', uploadEvidences.array('evidencias'), function(req, res){
    res.redirect('/secure/prueba');
});
//////////////////////////////////////// FIN DE PRUEBAS ///////////////////////////////////////

router.get('/dashboard',function(req, res){
    var ft = req.session.user.firsttime;
    if(ft == 1) {
        var dashboard = mysql.dashboard.getDashboardTypes();
        var commitment = mysql.commitment.getCommitmentTypes();
        var monitor = mysql.monitor.getMonitorTypes();
        res.render('partial/dashboard/dashboard',{dashboard: dashboard, commitment: commitment, monitor: monitor});
    } else {
        res.render('partial/dashboard/dashboard');
    }
});

router.get('/register',function(req, res){
    var commitment = mysql.commitment.getCommitmentTypes();
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/commitment/register',{commitment: commitment,commitmentconfig: commitmentconfig});
});

router.get('/commitdetail/:nrocorrelativo', function(req, res){
    var nrocorrelativo = req.params.nrocorrelativo;
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitment = mysql.commitment.getCommitmentsByCorrelative(req.session.user.t_company_ruc,commitmentconfig,nrocorrelativo);
    res.render('partial/commitment/commitdetail',{nrocorrelativo:nrocorrelativo,commitment:commitment[0],commitmentconfig: commitmentconfig});
});

router.get('/commitedit/:nrocorrelativo', function(req, res){
    var nrocorrelativo = req.params.nrocorrelativo;
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitment = mysql.commitment.getCommitmentsByCorrelative(req.session.user.t_company_ruc,commitmentconfig,nrocorrelativo);
    res.render('partial/commitment/commitedit',{nrocorrelativo:nrocorrelativo,commitment:commitment[0],commitmentconfig: commitmentconfig});
});

router.get('/listall', function(req, res){
    var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitments = mysql.commitment.getCommitmentsByRuc(req.session.user.t_company_ruc,comconfig);
    res.render('partial/commitment/listall',{comconfig: comconfig, commitments: commitments});
});

router.get('/update', function(req, res){
    res.render('partial/update');
});

router.get('/home', function(req, res){
    res.render('partial/home');
});

router.get('/massive', function(req, res){
    res.render('partial/commitment/massive');
});

router.get('/configattrdashboard', function(req, res){
    var dashboard = mysql.dashboard.getDashboardTypes();
    var dashboardconfig = mysql.dashboard.getDashboardConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/dashboard/configattrdashboard',{dashboard: dashboard,dashboardconfig: dashboardconfig});
});
router.get('/configattrcommit', function(req, res){
    var commitment = mysql.commitment.getCommitmentTypes();
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/commitment/configattrcommit',{commitment: commitment,commitmentconfig: commitmentconfig});
});
router.get('/configattrmonit', function(req, res){
    var monitor = mysql.monitor.getMonitorTypes();
    var monitorconfig = mysql.monitor.getMonitConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/monitor/configattrmonit',{monitor: monitor,monitorconfig: monitorconfig});
});
router.get('/listallmonit', function(req, res){
    var monitconfig;
    monitconfig = mysql.monitor.getMonitConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/monitor/listallmonit',{monitconfig: monitconfig});
});
router.get('/massivemonit', function(req, res){
    res.render('partial/monitor/massivemonit');
});
router.get('/registermonit', function(req, res){
    res.render('partial/monitor/registermonit');
});
router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

router.get('/downloadtemplate', function(req, res){
    var workbook = new Excel.Workbook();
    workbook.creator = 'Nolan';
    workbook.lastModifiedBy = 'Nolan';
    workbook.created = new Date();
    workbook.modified = new Date();
    var worksheet = workbook.addWorksheet('Compromisos');

    var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    worksheet.mergeCells(1,1,1,comconfig.length);
    worksheet.getCell('A1').value = 'Matriz Integrada de Compromisos de la Unidad de ' + req.session.user.unidad;
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
            cell.name = comconfig[colNumber - 1].columnasoc;
        });
    });

    var downloadpath = path.resolve('downloads/' + req.session.user.t_company_ruc);
    var filename = req.session.user.userid + '-plantilla.xlsx';
    var fullpath = downloadpath + '/' + filename;
    workbook.xlsx.writeFile(fullpath)
    .then(function() {
        res.attachment('plantilla.xlsx');
        res.sendFile(fullpath);
    });
});

router.get('/users', function(req, res){
    var users;
    users = mysql.user.getUsersByRuc(req.session.user.t_company_ruc);
    res.render('partial/users', {users: users});
});

router.get('/userscreate', function(req, res){
    res.render('partial/userscreate');
});

// TODAS LAS LLAMADAS POST

router.post('/uploadcomtemplate',udploadComTemplate.single('template'), function(req,res){
    var workbook = new Excel.Workbook();
    var uploadpath = path.resolve('uploads/' + req.session.user.t_company_ruc);
    var filename = req.file.filename;
    var fullpath = uploadpath + '/' + filename;
    workbook.xlsx.readFile(fullpath)
    .then(function() {
        var worksheet = workbook.getWorksheet(1);
        var compcomm = mysql.commitment.getComConfigByRucForInsert(req.session.user.t_company_ruc);
        if(worksheet.actualColumnCount == compcomm.length) {
            console.log('Antes de Rows');
            var comdatatotal = [];
            worksheet.eachRow(function(row, rowNumber) {
                if(rowNumber > 2) {
                    var comdata = [];
                    comdata.push(req.session.user.t_company_ruc);
                    row.eachCell(function(cell, colNumber) {
                        console.log(computil.checktype(cell.value));
                        if (computil.checktype(cell.value) == 'date') {
                            comdata.push(dateFormat((new Date(cell.value.valueOf() + cell.value.getTimezoneOffset() * 60000)),'yyyy-mm-dd'));
                        } else {
                            comdata.push(cell.value);
                        }
                    });
                    comdata.push(req.session.user.userid);
                    comdatatotal.push(comdata);
                }
            });
            mysql.commitment.createCommitment(req.session.user.t_company_ruc, compcomm, comdatatotal);
            res.redirect('/secure/listall');
        } else {
            console.log('Los campos no coinciden');
            res.redirect('/secure/listall');
        }
    });
});

router.post('/uploadmontemplate',udploadMonTemplate.single('template'), function(req,res){
    var workbook = new Excel.Workbook();
    var uploadpath = path.resolve('uploads/' + req.session.user.t_company_ruc);
    var filename = req.file.filename;
    var fullpath = uploadpath + '/' + filename;
    workbook.xlsx.readFile(fullpath)
    .then(function() {
        var worksheet = workbook.getWorksheet(1);
        var compcomm = mysql.monitor.getComConfigByRucForInsert(req.session.user.t_company_ruc);
        if(worksheet.actualColumnCount == compcomm.length) {
            console.log('Antes de Rows');
            var comdatatotal = [];
            worksheet.eachRow(function(row, rowNumber) {
                if(rowNumber > 2) {
                    var comdata = [];
                    comdata.push(req.session.user.t_company_ruc);
                    row.eachCell(function(cell, colNumber) {
                        console.log(computil.checktype(cell.value));
                        if (computil.checktype(cell.value) == 'date') {
                            comdata.push(dateFormat((new Date(cell.value.valueOf() + cell.value.getTimezoneOffset() * 60000)),'yyyy-mm-dd'));
                        } else {
                            comdata.push(cell.value);
                        }
                    });
                    comdata.push(req.session.user.userid);
                    comdatatotal.push(comdata);
                }
            });
            mysql.commitment.createCommitment(req.session.user.t_company_ruc, compcomm, comdatatotal);
            res.redirect('/secure/listall');
        } else {
            console.log('Los campos no coinciden');
            res.redirect('/secure/listall');
        }
    });
});

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
    mysql.company.updateCompanyByRuc(req.session.user.t_company_ruc,razonsocial,unidadinit,proyoper);
    mysql.dashboard.updateDashboardConfig(req.session.user.t_company_ruc,dashboard);
    mysql.commitment.updateCommitmentConfig(req.session.user.t_company_ruc,compromisos);    
    mysql.monitor.updateMonitorConfig(req.session.user.t_company_ruc,monitoreo);
    mysql.company.updateCompanyByRuc(req.session.user.t_company_ruc,razonsocial,unidadinit,proyoper);
    mysql.dashboard.updateDashboardConfig(req.session.user.t_company_ruc,dashboard);
    mysql.commitment.updateCommitmentConfig(req.session.user.t_company_ruc,compromisos);
    mysql.monitor.updateMonitorConfig(req.session.user.t_company_ruc,monitoreo);
    var result = mysql.company.updateFirstTime(req.session.user.t_company_ruc,0);
    if(result.affectedRows == 1) {
        req.session.user.firsttime = 0;
    }
    res.redirect('/secure/dashboard');
});

router.post('/configattrcommit', function(req, res){
    //sección compromisos
    var compromisos = req.body.compromisos;
    //sección etapascompromiso
    var etapascompromiso = req.body.etapascompromiso;
    //sección Eliminar data
    var result = mysql.commitment.deleteCommitmentTypes(req.session.user.t_company_ruc);
    mysql.commitment.updateCommitmentConfig(req.session.user.t_company_ruc,compromisos);
    res.redirect('/secure/configattrcommit');
});

router.post('/configattrmonit', function(req, res){
    var monitoreo = req.body.monitoreo;
    //sección etapasmonitoreo
    var etapasmonitoreo = req.body.etapasmonitoreo;
    //sección Eliminar data
    var result = mysql.monitor.deleteMonitorTypes(req.session.user.t_company_ruc);
    mysql.monitor.updateMonitorConfig(req.session.user.t_company_ruc,monitoreo);
    res.redirect('/secure/configattrmonit');
});

router.post('/configattrdashboard', function(req, res){
    //sección dashboard
    var dashboard = req.body.dashboard;
    //sección Eliminar data
    var result = mysql.dashboard.deleteDashboardTypes(req.session.user.t_company_ruc);
    mysql.dashboard.updateDashboardConfig(req.session.user.t_company_ruc,dashboard);    
    res.redirect('/secure/configattrdashboard');
});

router.post('/userscreate', function(req, res, next){
    var userid = req.body.userid;
    var email = req.body.email;
    var name = req.body.name;
    var rol = req.body.rol;
    var lastname = req.body.lastname;
    var password = req.body.password;

    try {
        // Registering information
        mysql.user.createUser(userid, computil.createHash(config().checksumhash,password), email, name, lastname, req.session.user.t_company_ruc, rol, 1);

        var htmlRegistrationTemplate = computil.loadEmailTemplate('security_newuser');
        if(htmlRegistrationTemplate == '') {
            var error = new Error('La plantilla de correo no pudo ser cargada');
            next(error);
        } else {
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$COMPANY_NAME',req.session.user.companyname);
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$BASE_URL',config().baseUrl);
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$USERID',userid);
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$PASSWORD',password);
            compemail.sendEmail(email,'Registro en NOLAN',htmlRegistrationTemplate);
        }
        res.redirect('/secure/users');
    } catch(e) {
        mysql.user.deleteUserById(req.session.user.t_company_ruc, userid);
        next(e);
    }
});

router.post('/deleteUser', function(req, res){
    var userid = req.body.userid;
    var result = mysql.user.deleteUserById(req.session.user.t_company_ruc,userid);
    res.redirect('/secure/users');
});

router.post('/resetConfigGlobal', function(req, res){
    var ruc = req.body.ruc;
    var result = mysql.company.deleteCompanyByRuc(ruc);
    var result = mysql.dashboard.deleteDashboardTypes(req.session.user.t_company_ruc);
    var result = mysql.commitment.deleteCommitmentTypes(req.session.user.t_company_ruc);
    var result = mysql.monitor.deleteMonitorTypes(req.session.user.t_company_ruc);
    var result = mysql.company.updateFirstTime(req.session.user.t_company_ruc,1);
    req.session.destroy();
    res.redirect('/');
    
});

router.post('/register', function(req, res){
    
    //insert dinamico
    var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    
    console.log('valores del comconfig :',comconfig);
    var comdata = [];
    comdata.push(req.session.user.t_company_ruc);
    for (var i = 0; i < comconfig.length; i++) {
        var item = req.body[comconfig[i].columnasoc];
        console.log('valor del item',item);
        if (computil.checktype(item) == 'date' || comconfig[i].columnasoc.startsWith('fecha')) {
            comdata.push(dateFormat((new Date(item),'yyyy-mm-dd')));
        } else {
            if (!item) {
                comdata.push(null);
            } else {
                if (comconfig[i].t_commitment_config_id == 'CM30' || comconfig[i].t_commitment_config_id == 'CM31'||comconfig[i].t_commitment_config_id == 'CM32'||comconfig[i].t_commitment_config_id == 'CM33'){
                    comdata.push('Si');
                }
                else {
                    comdata.push(item);
                }    
            }
        }
        
    }
    
    comdata.push(req.session.user.userid);
    console.log('valores del comdata :',comdata);
    mysql.commitment.createSingleCommitment(req.session.user.t_company_ruc, comconfig, comdata);
    console.log('valores del comdata final:',comdata);
    res.redirect('/secure/listall');

});

router.post('/deletecommit', function(req, res){
    var nrocorrelativo = req.body.nrocorrelativo;
    var result = mysql.commitment.deleteCommitmentByCorrelative(req.session.user.t_company_ruc,nrocorrelativo);
    res.redirect('/secure/listall');

});

router.post('/emailToSoporte', function(req, res, next){
    
    var userid = req.session.user.userid;
    var reception = mysql.user.getEmailByID(userid);
    var inbox = 'eschulergodo7@gmail.com';
    var emailtext = req.body.email;
    
    console.log('valor de recption',reception);

    try {
        // Sending information
        
        var htmlRegistrationTemplate = computil.loadEmailTemplate('security_support');
        if(htmlRegistrationTemplate == '') {
            var error = new Error('La plantilla de correo no pudo ser cargada');
            next(error);
        } else {
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$USERID',userid);
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$COMPANY_NAME',req.session.user.companyname);
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$EMAILTEXT',emailtext);
            htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$RECEPTION',reception[0].email);
            compemail.sendEmail(inbox,'Consulta de soporte a NOLAN',htmlRegistrationTemplate);
        }
        res.redirect('/secure/dashboard');
    } catch(e) {
        next(e);
    }
});
module.exports = router;

