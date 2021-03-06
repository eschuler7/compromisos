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
//Audit Log
var auditlog = require('../lib/auditlog');

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
var uploadEvidences = multer({storage: objectstorage.getEvidenceObjectStorage});

router.get('/dashboard',function(req, res){
    // commitment    
    var totalCommitmentByRuc = mysql.batch.totalCommitmentByRuc(req.session.user.t_company_ruc);
    var totalCommitmentBySeverity = mysql.batch.totalCommitmentBySeverity(req.session.user.t_company_ruc);
    var getCommitmentByStatusClosed = mysql.batch.getCommitmentByStatusClosed(req.session.user.t_company_ruc);
    var getCommitmentRequiereAction = mysql.batch.getCommitmentRequiereAction(req.session.user.t_company_ruc);
    var getCommitmentUncomplishedWithAction = mysql.batch.getCommitmentUncomplishedWithAction(req.session.user.t_company_ruc);
    var getCommitmentWithoutAction = mysql.batch.getCommitmentWithoutAction(req.session.user.t_company_ruc);
    var getCommitmentUncomplishedTotal = mysql.batch.getCommitmentUncomplishedTotal(req.session.user.t_company_ruc);
    var getCommitmentUncomplishedBySeverity = mysql.batch.getCommitmentUncomplishedBySeverity(req.session.user.t_company_ruc);
    
    var commitmentdesviation = 0;
    
    if (getCommitmentUncomplishedTotal[0].compromisosincumplidostotal != 0) {
        commitmentdesviation = Math.round((getCommitmentUncomplishedTotal[0].compromisosincumplidostotal*100/totalCommitmentByRuc[0].totalcompromisos)*100)/100;
        console.log(commitmentdesviation);
    }

    var commitmenthighseverity = 0;
    var commitmentmediumseverity = 0;
    var commitmentlowseverity = 0;

    for (var i = 0; i < totalCommitmentBySeverity.length; i++) {
        if(totalCommitmentBySeverity[i].criticidad == 'Alto') {
            commitmenthighseverity = Math.round((totalCommitmentBySeverity[i].totalcompromisoscriticidad*100/totalCommitmentByRuc[0].totalcompromisos)*100)/100;
        } else if (totalCommitmentBySeverity[i].criticidad == 'Bajo') {
            commitmentlowseverity = Math.round((totalCommitmentBySeverity[i].totalcompromisoscriticidad*100/totalCommitmentByRuc[0].totalcompromisos)*100)/100;
        } else if (totalCommitmentBySeverity[i].criticidad == 'Medio'){
            commitmentmediumseverity = Math.round((totalCommitmentBySeverity[i].totalcompromisoscriticidad*100/totalCommitmentByRuc[0].totalcompromisos)*100)/100;
        }
        
    }
    var getCommitmentUncomplishedBySeverityHigh = 0;
    var getCommitmentUncomplishedBySeverityMedium = 0;
    var getCommitmentUncomplishedBySeverityLow = 0;

    for (var i = 0; i < getCommitmentUncomplishedBySeverity.length; i++) {
        if(getCommitmentUncomplishedBySeverity[i].criticidad == 'Alto') {
            getCommitmentUncomplishedBySeverityHigh = getCommitmentUncomplishedBySeverity[i].compromisosincumpxcriticidad;
        } else if (getCommitmentUncomplishedBySeverity[i].criticidad == 'Bajo') {
            getCommitmentUncomplishedBySeverityLow = getCommitmentUncomplishedBySeverity[i].compromisosincumpxcriticidad;
        } else if (getCommitmentUncomplishedBySeverity[i].criticidad == 'Medio'){
            getCommitmentUncomplishedBySeverityMedium = getCommitmentUncomplishedBySeverity[i].compromisosincumpxcriticidad;
        }
    }

    // Monitor
    var totalMonitorByRuc = mysql.batch.totalMonitorByRuc(req.session.user.t_company_ruc);
    //var totalMonitorBySeverity = mysql.batch.totalMonitorBySeverity(req.session.user.t_company_ruc);
    var getMonitorByStatusClosed = mysql.batch.getMonitorByStatusClosed(req.session.user.t_company_ruc);
    var getMonitorRequiereAction = mysql.batch.getMonitorRequiereAction(req.session.user.t_company_ruc);
    var getMonitorUncomplishedWithAction = mysql.batch.getMonitorUncomplishedWithAction(req.session.user.t_company_ruc);
    var getMonitorWithoutAction = mysql.batch.getMonitorWithoutAction(req.session.user.t_company_ruc);
    var getMonitorUncomplishedTotal = mysql.batch.getMonitorUncomplishedTotal(req.session.user.t_company_ruc);
    //var getMonitorUncomplishedBySeverity = mysql.batch.getMonitorUncomplishedBySeverity(req.session.user.t_company_ruc);
    
    var monitordesviation = 0;
    
    if (getMonitorUncomplishedTotal[0].monitoroesincumplidostotal != 0) {
        monitordesviation = Math.round((getMonitorUncomplishedTotal[0].monitoroesincumplidostotal*100/totalMonitorByRuc[0].totalmonitoreo)*100)/100;
    }
    /*
    var monitorhighseverity = 0;
    var monitormediumseverity = 0;
    var monitorlowseverity = 0;

    for (var i = 0; i < totalMonitorBySeverity.length; i++) {
        if(totalMonitorBySeverity[i].criticidad == 'Alto') {
            monitorhighseverity = Math.round((totalMonitorBySeverity[i].totalmonitoreocriticidad*100/totalMonitorByRuc[0].totalmonitoreo)*100)/100;
        } else if (totalMonitorBySeverity[i].criticidad == 'Bajo') {
            monitorlowseverity = Math.round((totalMonitorBySeverity[i].totalmonitoreocriticidad*100/totalMonitorByRuc[0].totalmonitoreo)*100)/100;
        } else if (totalMonitorBySeverity[i].criticidad == 'Medio'){
            monitormediumseverity = Math.round((totalMonitorBySeverity[i].totalmonitoreocriticidad*100/totalMonitorByRuc[0].totalmonitoreo)*100)/100;
        }
        
    }
    var getMonitorUncomplishedBySeverityHigh = 0;
    var getMonitorUncomplishedBySeverityMedium = 0;
    var getMonitorUncomplishedBySeverityLow = 0;

    for (var i = 0; i < getMonitorUncomplishedBySeverity.length; i++) {
        if(getMonitorUncomplishedBySeverity[i].criticidad == 'Alto') {
            getMonitorUncomplishedBySeverityHigh = getMonitorUncomplishedBySeverity[i].monitoreoincumpxcriticidad;
        } else if (getMonitorUncomplishedBySeverity[i].criticidad == 'Bajo') {
            getMonitorUncomplishedBySeverityLow = getMonitorUncomplishedBySeverity[i].monitoreoincumpxcriticidad;
        } else if (getMonitorUncomplishedBySeverity[i].criticidad == 'Medio'){
            getMonitorUncomplishedBySeverityMedium = getMonitorUncomplishedBySeverity[i].monitoreoincumpxcriticidad;
        }
    }
    */
    res.render('partial/dashboard/dashboard',{
        totalCommitmentByRuc : totalCommitmentByRuc[0].totalcompromisos,
        commitmenthighseverity : commitmenthighseverity,
        commitmentmediumseverity : commitmentmediumseverity,
        commitmentlowseverity : commitmentlowseverity,
        getCommitmentByStatusClosed : getCommitmentByStatusClosed[0].totalcompromisoscerrados,
        getCommitmentRequiereAction : getCommitmentRequiereAction[0].compromisoreqaccion, 
        getCommitmentUncomplishedWithAction : getCommitmentUncomplishedWithAction[0].compromisoincumpconaccion, 
        getCommitmentWithoutAction : getCommitmentWithoutAction[0].compromisosinaccion,
        getCommitmentUncomplishedTotal : getCommitmentUncomplishedTotal[0].compromisosincumplidostotal, 
        getCommitmentUncomplishedBySeverityHigh : getCommitmentUncomplishedBySeverityHigh,
        getCommitmentUncomplishedBySeverityMedium : getCommitmentUncomplishedBySeverityMedium,
        getCommitmentUncomplishedBySeverityLow : getCommitmentUncomplishedBySeverityLow, 
        commitmentdesviation : commitmentdesviation, 
        totalMonitorByRuc : totalMonitorByRuc[0].totalmonitoreo,
        getMonitorByStatusClosed : getMonitorByStatusClosed[0].totalmonitorcerrados,
        getMonitorRequiereAction : getMonitorRequiereAction[0].monitoreoreqaccion, 
        getMonitorUncomplishedWithAction : getMonitorUncomplishedWithAction[0].monitoreoincumpconaccion, 
        getMonitorWithoutAction : getMonitorWithoutAction[0].monitoreosinaccion,
        getMonitorUncomplishedTotal : getMonitorUncomplishedTotal[0].monitoroesincumplidostotal, 
        monitordesviation : monitordesviation, 
        notification: req.notification});

});
router.get('/home',function(req, res){
    var ft = req.session.user.firsttime;
    if(ft == 1) {
        var dashboard = mysql.dashboard.getDashboardTypes();
        var commitment = mysql.commitment.getCommitmentTypes();
        var monitor = mysql.monitor.getMonitorTypes();
        res.render('partial/home',{dashboard: dashboard, commitment: commitment, monitor: monitor,notification: req.notification});
    } else {

        res.render('partial/home',{notification: req.notification});

    }
});

router.get('/commitregister',function(req, res){
    var commitment = mysql.commitment.getCommitmentTypes();
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/commitment/commitregister',{commitment: commitment,commitmentconfig: commitmentconfig,notification: req.notification});
});

router.get('/commitdetail/:nrocorrelativo', function(req, res){
    var nrocorrelativo = req.params.nrocorrelativo;
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitment = mysql.commitment.getCommitmentByCorrelative(req.session.user.t_company_ruc,commitmentconfig,nrocorrelativo);
    var commitmentevidence = mysql.evidence.getEvidences(req.session.user.t_company_ruc, nrocorrelativo);
    res.render('partial/commitment/commitdetail',{nrocorrelativo:nrocorrelativo,commitment:commitment[0],commitmentconfig: commitmentconfig, commitmentevidence: commitmentevidence,notification: req.notification});
});

router.get('/commitedit/:nrocorrelativo', function(req, res){
    var nrocorrelativo = req.params.nrocorrelativo;
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitment = mysql.commitment.getCommitmentByCorrelative(req.session.user.t_company_ruc,commitmentconfig,nrocorrelativo);
    res.render('partial/commitment/commitedit',{nrocorrelativo:nrocorrelativo,commitment:commitment[0],commitmentconfig: commitmentconfig,notification: req.notification});
});

router.get('/commitlist', function(req, res){
    var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var columns = [];
    var evipos = -1
    for (var i = 0; i < comconfig.length; i++) {
        if(comconfig[i].columnasoc == 'evidencias') {
            evipos = i;
        } else {
            var data = {data:comconfig[i].columnasoc};
            columns.push(data);
        }
    }
    //columns.push({data:'options',defaultContent:'Hola'});
    if(evipos > -1)
        comconfig.splice(evipos,1);
    res.render('partial/commitment/commitlist',{comconfig: comconfig, columns: JSON.stringify(columns), notification: req.notification});
});

router.get('/commitlistrest',function(req,res){
    var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitments = mysql.commitment.getCommitmentsByRuc(req.session.user.t_company_ruc,comconfig);
    res.setHeader('Content-Type','application/json');
    res.send({data:commitments});
});

router.get('/dashboardconfigattr', function(req, res){
    var dashboard = mysql.dashboard.getDashboardTypes();
    var dashboardconfig = mysql.dashboard.getDashboardConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/dashboard/dashboardconfigattr',{dashboard: dashboard,dashboardconfig: dashboardconfig,notification: req.notification});
});
router.get('/commitconfigattr', function(req, res){
    var commitment = mysql.commitment.getCommitmentTypes();
    var commitmentconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/commitment/commitconfigattr',{commitment: commitment,commitmentconfig: commitmentconfig,notification: req.notification});
});
router.get('/monitconfigattr', function(req, res){
    var monitor = mysql.monitor.getMonitorTypes();
    var monitorconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/monitor/monitconfigattr',{monitor: monitor,monitorconfig: monitorconfig,notification: req.notification});
});
router.get('/monitlist', function(req, res){
    var monitconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var columns = [];
    var evipos = -1
    for (var i = 0; i < monitconfig.length; i++) {
        if(monitconfig[i].columnasoc == 'evidencias') {
            evipos = i;
        } else {
            var data = {data:monitconfig[i].columnasoc};
            columns.push(data);
        }
    }
    //columns.push({data:'options',defaultContent:'Hola'});
    if(evipos > -1)
        monitconfig.splice(evipos,1);
    res.render('partial/monitor/monitlist',{monitconfig: monitconfig,columns: JSON.stringify(columns),notification: req.notification});
});
router.get('/monitlistrest', function(req, res){
    var monitconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var monitors = mysql.monitor.getMonitorsByRuc(req.session.user.t_company_ruc,monitconfig);
    res.setHeader('Content-Type','application/json');
    res.send({data:monitors});
});

router.get('/monitdetail/:nrocorrelativo', function(req, res){
    var nrocorrelativo = req.params.nrocorrelativo;
    var monitconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var monitor = mysql.monitor.getMonitorByCorrelative(req.session.user.t_company_ruc,monitconfig,nrocorrelativo);
    var monitorevidence = mysql.evidence.getEvidencesMonit(req.session.user.t_company_ruc, nrocorrelativo);
    res.render('partial/monitor/monitdetail',{nrocorrelativo:nrocorrelativo,monitor:monitor[0],monitconfig: monitconfig, monitorevidence: monitorevidence,notification: req.notification});
});
router.get('/monitedit/:nrocorrelativo', function(req, res){
    var nrocorrelativo = req.params.nrocorrelativo;
    var monitconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var monitor = mysql.monitor.getMonitorByCorrelative(req.session.user.t_company_ruc,monitconfig,nrocorrelativo);
    res.render('partial/monitor/monitedit',{nrocorrelativo:nrocorrelativo,monitor:monitor[0],monitconfig: monitconfig,notification: req.notification});
});
router.get('/commitmassive', function(req, res){
    res.render('partial/commitment/commitmassive',{notification: req.notification});
});
router.get('/monitmassive', function(req, res){
    res.render('partial/monitor/monitmassive',{notification: req.notification});
});

router.get('/monitregister', function(req, res){
    var monitor = mysql.monitor.getMonitorTypes();
    var monitorconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    res.render('partial/monitor/monitregister',{monitor: monitor,monitorconfig: monitorconfig,notification: req.notification});
});
router.get('/logout', function(req, res){
    req.ruc = req.session.user.t_company_ruc;
    req.companyname = req.session.user.companyname;
    req.userid = req.session.user.userid;
    req.session.destroy();
    res.redirect('/');
    auditlog(req);
});

router.get('/commitexportexcel', function(req, res){
    var comconfigbyruc = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var commitments = mysql.commitment.getCommitmentsByRucForExport(req.session.user.t_company_ruc,comconfigbyruc);

    if(commitments.length > 0){
        var workbook = new Excel.Workbook();
        workbook.creator = 'Nolan';
        workbook.lastModifiedBy = 'Nolan';
        workbook.created = new Date();
        workbook.modified = new Date();
        var wscommit = workbook.addWorksheet('Compromisos');
        var header = [];
        for (var i = 0; i < comconfigbyruc.length; i++) {
            if(comconfigbyruc[i].columnasoc != 'evidencias') {
                header.push(comconfigbyruc[i].name);
            }
        }
        wscommit.addRow(header);
        for (var i = 0; i < commitments.length; i++) {
            var row = [];
            for (var j = 0; j < comconfigbyruc.length; j++) {
                if(comconfigbyruc[j].columnasoc != 'evidencias') {
                    row.push(commitments[i][comconfigbyruc[j].columnasoc]);
                }
            }
            wscommit.addRow(row);
        }
        wscommit.eachRow(function(row, rowNumber) {
            for (var i = 0; i < comconfigbyruc.length - 1; i++) {
                row.getCell(i+1).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
            }
        });
        var downloadpath = path.resolve('downloads/' + req.session.user.t_company_ruc);
        var filename = req.session.user.userid + '-export-commitments.xlsx';
        var fullpath = downloadpath + '/' + filename;
        workbook.xlsx.writeFile(fullpath)
        .then(function() {
            res.attachment('Export_Compromisos.xlsx');
            res.sendFile(fullpath);
        });
    } else {
        req.session.notification = computil.notification('info','Sin Registros','No se cuenta con registros para realizar la exportación.');
        res.redirect('/secure/commitlist');
    }
});

router.get('/committemplate', function(req, res){
    var workbook = new Excel.Workbook();
    workbook.creator = 'Nolan';
    workbook.lastModifiedBy = 'Nolan';
    workbook.created = new Date();
    workbook.modified = new Date();

    var comconfigbyruc = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var comconfig = mysql.commitment.getCommitmentTypes();

    var wscommit = workbook.addWorksheet('Compromisos');
    wscommit.mergeCells(1,1,1,comconfigbyruc.length - 1); // menos 1 por el campo de evidencias
    wscommit.getCell('A1').value = 'Matriz Integrada de Compromisos de la Unidad de ' + req.session.user.unidad;
    for (var i = 0; i < comconfigbyruc.length - 1; i++) {
        wscommit.getColumn(i + 1).width = 20;
    }
    var row = [];
    for (var i = 0; i < comconfigbyruc.length; i++) {
        if(comconfigbyruc[i].columnasoc != 'evidencias') {
            row.push(comconfigbyruc[i].name);
        }
    }
    wscommit.addRow(row);
    wscommit.addRow([1]);
    wscommit.eachRow(function(row, rowNumber) {
        if(rowNumber < 3) {
            row.eachCell(function(cell, colNumber) {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                };
                cell.name = comconfigbyruc[colNumber - 1].columnasoc;
            });
        } else {
            for (var i = 0; i < comconfigbyruc.length - 1; i++) {
                row.getCell(i+1).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
            }
        }
    });

    var wscaption = workbook.addWorksheet('Leyenda');
    wscaption.getColumn(1).width = 40;
    wscaption.getColumn(2).width = 180;
    wscaption.getCell('A1').value = 'Descripción de los campos.';
    wscaption.addRow(['Nombre', 'Descripción']);
    for (var i = 0; i < comconfig.length; i++) {
        wscaption.addRow([comconfig[i].name, comconfig[i].description]);
    }
    wscaption.eachRow(function(row, rowNumber){
        row.eachCell(function(cell, colNumber){
            cell.border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
        });
    });

    var downloadpath = path.resolve('downloads/' + req.session.user.t_company_ruc);
    var filename = req.session.user.userid + '-compromiso-plantilla.xlsx';
    var fullpath = downloadpath + '/' + filename;
    workbook.xlsx.writeFile(fullpath)
    .then(function() {
        res.attachment('Plantilla_Compromisos.xlsx');
        res.sendFile(fullpath);
    });
});

router.get('/monittemplate', function(req, res){
    var workbook = new Excel.Workbook();
    workbook.creator = 'Nolan';
    workbook.lastModifiedBy = 'Nolan';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    var monconfigbyruc = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var monconfig = mysql.monitor.getMonitorTypes();

    var wsmonit = workbook.addWorksheet('Monitoreos');
    wsmonit.mergeCells(1,1,1,monconfigbyruc.length - 1);
    wsmonit.getCell('A1').value = 'Matriz Integrada de Monitoreo de la Unidad de ' + req.session.user.unidad;
    for (var i = 0; i < monconfigbyruc.length - 1; i++) {
        wsmonit.getColumn(i + 1).width = 20;
    }
    var row = [];
    for (var i = 0; i < monconfigbyruc.length; i++) {
        if(monconfigbyruc[i].columnasoc != 'evidencias') {
            row.push(monconfigbyruc[i].name);
        }
    }
    wsmonit.addRow(row);
    wsmonit.addRow([1]);

    wsmonit.eachRow(function(row, rowNumber) {
        if(rowNumber < 3) {
            row.eachCell(function(cell, colNumber) {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: {style:'medium'},
                    left: {style:'medium'},
                    bottom: {style:'medium'},
                    right: {style:'medium'}
                };
                cell.name = monconfigbyruc[colNumber - 1].columnasoc;
            });
        } else {
            for (var i = 0; i < monconfigbyruc.length - 1; i++) {
                row.getCell(i+1).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
            }
        }
    });
    var wscaption = workbook.addWorksheet('Leyenda');
    wscaption.getColumn(1).width = 40;
    wscaption.getColumn(2).width = 180;
    wscaption.getCell('A1').value = 'Descripción de los campos.';
    wscaption.addRow(['Nombre', 'Descripción']);
    for (var i = 0; i < monconfig.length; i++) {
        wscaption.addRow([monconfig[i].name, monconfig[i].description]);
    }
    wscaption.eachRow(function(row, rowNumber){
        row.eachCell(function(cell, colNumber){
            cell.border = {
               top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
        });
    });

    var downloadpath = path.resolve('downloads/' + req.session.user.t_company_ruc);
    var filename = req.session.user.userid + '-monitoreo-plantilla.xlsx';
    var fullpath = downloadpath + '/' + filename;
    workbook.xlsx.writeFile(fullpath)
    .then(function() {
        res.attachment('Plantilla_Monitoreo.xlsx');
        res.sendFile(fullpath);
    });
});

router.get('/monitexportexcel', function(req, res){
    var monconfigbyruc = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var monitors = mysql.monitor.getMonitorsByRucForExport(req.session.user.t_company_ruc,monconfigbyruc);
    if(monitors.length > 0){
        var workbook = new Excel.Workbook();
        workbook.creator = 'Nolan';
        workbook.lastModifiedBy = 'Nolan';
        workbook.created = new Date();
        workbook.modified = new Date();
        var wscommit = workbook.addWorksheet('Monitoreos');
        var header = [];
        for (var i = 0; i < monconfigbyruc.length; i++) {
            if(monconfigbyruc[i].columnasoc != 'evidencias') {
                header.push(monconfigbyruc[i].name);
            }
        }
        wscommit.addRow(header);
        for (var i = 0; i < monitors.length; i++) {
            var row = [];
            for (var j = 0; j < monconfigbyruc.length; j++) {
                if(monconfigbyruc[j].columnasoc != 'evidencias') {
                    row.push(monitors[i][monconfigbyruc[j].columnasoc]);
                }
            }
            wscommit.addRow(row);
        }
        wscommit.eachRow(function(row, rowNumber) {
            for (var i = 0; i < monconfigbyruc.length - 1; i++) {
                row.getCell(i+1).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
            }
        });
        var downloadpath = path.resolve('downloads/' + req.session.user.t_company_ruc);
        var filename = req.session.user.userid + '-export-monitors.xlsx';
        var fullpath = downloadpath + '/' + filename;
        workbook.xlsx.writeFile(fullpath)
        .then(function() {
            res.attachment('Export_Monitoreos.xlsx');
            res.sendFile(fullpath);
        });
    } else {
        req.session.notification = computil.notification('info','Sin Registros','No se cuenta con registros para realizar la exportación.');
        res.redirect('/secure/monitlist');
    }
});

router.get('/userlist', function(req, res){
    res.render('partial/users/userlist', {notification: req.notification});
});
router.get('/userlistrest', function(req, res){
    var users = mysql.user.getUsersByRuc(req.session.user.t_company_ruc);
    res.setHeader('Content-Type','application/json');
    res.send({data:users});
});

router.get('/usercreate', function(req, res){
    res.render('partial/users/usercreate',{notification: req.notification});
});

router.get('/downloadcomevidence/:correlativo/:evicorrelativo/:filename', function(req, res){
    var correlativo = req.params.correlativo;
    var evicorrelativo = req.params.evicorrelativo;
    var filename = req.params.filename;
    objectstorage.file.downloadFile(req.session.user.t_company_ruc, 'commitment',correlativo, evicorrelativo, filename, res);
});

// TODAS LAS LLAMADAS POST

router.post('/validateuserid', function(req, res){
    var userid = req.body.userid;
    var result = mysql.user.validateUserId(userid);
    if(result.length > 0) {
        res.send(false);
    } else {
        res.send(true);
    }
});

router.post('/uploadcomtemplate',udploadComTemplate.single('template'), function(req,res){
    var workbook = new Excel.Workbook();
    var uploadpath = path.resolve('uploads/' + req.session.user.t_company_ruc);
    var filename = req.file.filename;
    var fullpath = uploadpath + '/' + filename;
    workbook.xlsx.readFile(fullpath)
    .then(function() {
        var worksheet = workbook.getWorksheet(1);
        var compcomm = mysql.commitment.getComConfigByRucForInsert(req.session.user.t_company_ruc);
        if(worksheet.actualColumnCount == (compcomm.length - 1)) {
            var comdatatotal = [];
            worksheet.eachRow(function(row, rowNumber) {
                if(rowNumber > 2) {
                    var comdata = [];
                    comdata.push(req.session.user.t_company_ruc);
                    row.eachCell({includeEmpty:true}, function(cell, colNumber) {
                        if (computil.checktype(cell.value) == 'date') {
                            comdata.push(dateFormat((new Date(cell.value.valueOf() + cell.value.getTimezoneOffset() * 60000)),'yyyy-mm-dd'));
                        } else if (computil.checktype(cell.value) == 'object') {
                            comdata.push(cell.value.text);
                        } else {
                            comdata.push(cell.value);
                        }
                    });
                    comdata.push(req.session.user.userid);
                    comdatatotal.push(comdata);
                }
            });
            mysql.commitment.createBulkCommitments(compcomm, comdatatotal, req, res);
            auditlog(req);
        } else {
            req.session.notification = computil.notification('error','Error de Caga Masiva','Los campos de la plantilla no coinciden');
            res.send('error');
        }
    }).catch( function(reason) {
        console.error( 'onRejected function called: ', reason );
        req.session.notification = computil.notification('error','Error de Caga Masiva','Hubo un error durante la carga masiva, por favor verifique los datos e intente nuevamente.');
        res.send('error');
    });;
});

router.post('/uploadmontemplate',udploadMonTemplate.single('template'), function(req,res){
    var workbook = new Excel.Workbook();
    var uploadpath = path.resolve('uploads/' + req.session.user.t_company_ruc);
    var filename = req.file.filename;
    var fullpath = uploadpath + '/' + filename;
    workbook.xlsx.readFile(fullpath)
    .then(function() {
        var worksheet = workbook.getWorksheet(1);
        var monconf = mysql.monitor.getMonitorConfigByRucForInsert(req.session.user.t_company_ruc);
        if(worksheet.actualColumnCount == (monconf.length - 1)) { // menos uno porque no se cuenta las evidencias en la carga
            var mondatatotal = [];
            worksheet.eachRow(function(row, rowNumber) {
                if(rowNumber > 2) {
                    var mondata = [];
                    mondata.push(req.session.user.t_company_ruc);
                    row.eachCell({includeEmpty:true},function(cell, colNumber) {
                        if (computil.checktype(cell.value) == 'date') {
                            mondata.push(dateFormat((new Date(cell.value.valueOf() + cell.value.getTimezoneOffset() * 60000)),'yyyy-mm-dd'));
                        } else if (computil.checktype(cell.value) == 'object') {
                            comdata.push(cell.value.text);
                        } else {
                            mondata.push(cell.value);
                        }
                    });
                    mondata.push(req.session.user.userid);
                    mondatatotal.push(mondata);
                }
            });
            mysql.monitor.createBulkMonitor(monconf, mondatatotal, req, res);
            auditlog(req);
        } else {
            req.session.notification = computil.notification('error','Error de Caga Masiva','Los campos de la plantilla no coinciden');
            res.send('error');
        }
    }).catch( function(reason) {
        console.error( 'onRejected function called: ', reason );
        req.session.notification = computil.notification('error','Error de Caga Masiva','Hubo un error durante la carga masiva, por favor verifique los datos e intente nuevamente.');
        res.send('error');
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
    var result = mysql.company.updateFirstTime(req.session.user.t_company_ruc,0);
    if(result.affectedRows == 1) {
        req.session.user.firsttime = 0;
        // Creating object storage
        objectstorage.container.createContainer(req.session.user.t_company_ruc);
    }
    res.redirect('/secure/home');
});

router.post('/commitconfigattr', function(req, res){
    //sección compromisos
    var compromisos = req.body.compromisos;
    //sección etapascompromiso
    var etapascompromiso = req.body.etapascompromiso;
    //sección Eliminar data
    var result = mysql.commitment.deleteCommitmentTypes(req.session.user.t_company_ruc);
    mysql.commitment.updateCommitmentConfig(req.session.user.t_company_ruc,compromisos);
    req.session.notification = computil.notification('success','Registro Satisfactorio','Se actualizaron los atributos');
    res.redirect('/secure/commitconfigattr');
});

router.post('/monitconfigattr', function(req, res){
    var monitoreo = req.body.monitoreo;
    //sección etapasmonitoreo
    var etapasmonitoreo = req.body.etapasmonitoreo;
    //sección Eliminar data
    var result = mysql.monitor.deleteMonitorTypes(req.session.user.t_company_ruc);
    mysql.monitor.updateMonitorConfig(req.session.user.t_company_ruc,monitoreo);
    req.session.notification = computil.notification('success','Registro Satisfactorio','Se actualizaron los atributos');
    res.redirect('/secure/monitconfigattr');
});

router.post('/dashboardconfigattr', function(req, res){
    //sección dashboard
    var dashboard = req.body.dashboard;
    //sección Eliminar data
    var result = mysql.dashboard.deleteDashboardTypes(req.session.user.t_company_ruc);
    mysql.dashboard.updateDashboardConfig(req.session.user.t_company_ruc,dashboard);
    req.session.notification = computil.notification('success','Registro Satisfactorio','Se actualizaron los atributos');    
    res.redirect('/secure/dashboardconfigattr');
});

router.post('/usercreate', function(req, res, next){
    var userid = req.body.userid;
    req.idaffected = userid; // Para auditoría
    var email = req.body.email;
    var name = req.body.name;
    var rol = req.body.rol;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var limitusers = mysql.user.getCountUsersByRuc(req.session.user.t_company_ruc);

    if (limitusers[0].totalusers < 10) {
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
            req.session.notification = computil.notification('success','Registro Satisfactorio','El usuario ha sido creado');
            res.redirect('/secure/userlist');
            auditlog(req);
        } catch(e) {
            mysql.user.deleteUserById(req.session.user.t_company_ruc, userid);
            next(e);
        }
    } else {
       req.session.notification = computil.notification('error','Error de registro','Límite de usuarios excedido');
       res.redirect('/secure/userlist');
    }
});

router.post('/userdelete', function(req, res){
    var userid = req.body.userid;
    req.idaffected = userid; // Para auditoría
    var result = mysql.user.deleteUserById(req.session.user.t_company_ruc,userid);
    req.session.notification = computil.notification('success','Eliminación existosa','Se eliminó el usuario');
    res.redirect('/secure/userlist');
    auditlog(req);
});

router.post('/resetConfigGlobal', function(req, res){
    //var result = mysql.company.deleteCompanyByRuc(ruc);
    var result = mysql.commitment.deleteAllCommitments(req.session.user.t_company_ruc);
    var result = mysql.monitor.deleteAllMonitors(req.session.user.t_company_ruc);
    var result = mysql.dashboard.deleteDashboardTypes(req.session.user.t_company_ruc);
    var result = mysql.commitment.deleteCommitmentTypes(req.session.user.t_company_ruc);
    var result = mysql.monitor.deleteMonitorTypes(req.session.user.t_company_ruc);
    var result = mysql.user.deleteAllUserById(req.session.user.t_company_ruc,req.session.user.userid);
    var result = mysql.company.updateFirstTime(req.session.user.t_company_ruc,1);
    objectstorage.container.destroyContainer(req.session.user.t_company_ruc);
    req.ruc = req.session.user.t_company_ruc;
    req.companyname = req.session.user.companyname;
    req.userid = req.session.user.userid;
    req.session.destroy();
    res.redirect('/');
    auditlog(req);
});

router.post('/commitregister', function(req, res, next){
    // obteniendo correlativo
    req.type = 'commitment';
    var correlativocom = mysql.commitment.getNextCorrelative(req.session.user.t_company_ruc); // correlativo para compromisos
    req.comcorrelativo = correlativocom[0].correlativo;
    req.correlativo = correlativocom[0].correlativo; // para object storage
    req.idaffected = correlativocom[0].correlativo; // Para auditoría
    //var correlativoevi = mysql.evidence.getNextCorrelative(req.session.user.t_company_ruc, req.comcorrelativo); // correlativo para evidencias
    req.evicorrelativo = 1;
    next();
},uploadEvidences.array('evidencias'),function(req, res){
    var comconfig = mysql.commitment.getComConfigByRuc(req.session.user.t_company_ruc);
    var comdata = [];
    comdata.push(req.session.user.t_company_ruc);

    for (var i = 0; i < comconfig.length; i++) {
        if(comconfig[i].columnasoc != 'evidencias') {
            if (comconfig[i].columnasoc == 'nrocorrelativo') {
                comdata.push(req.comcorrelativo);
            } else {
                var item = req.body[comconfig[i].columnasoc];
                if (!item) {
                    comdata.push(null);
                } else {
                    if (computil.checktype(item) == 'date') {
                        comdata.push(dateFormat((new Date(item),'yyyy-mm-dd')));
                    } else if(comconfig[i].columnasoc.startsWith('fecha')) {
                        var fecarray = item.split('/');
                        comdata.push(fecarray[2] + '-' + fecarray[1] + '-' + fecarray[0]);
                    } else {
                        if (comconfig[i].t_commitment_config_id == 'CM28' || comconfig[i].t_commitment_config_id == 'CM29'||comconfig[i].t_commitment_config_id == 'CM30'||comconfig[i].t_commitment_config_id == 'CM31'){
                            comdata.push('Si');
                        }
                        else {
                            comdata.push(item);
                        }
                    }
                }

            }
        }
    }
    comdata.push(req.session.user.userid);
    var result = mysql.commitment.createSingleCommitment(comconfig, comdata);
    if(result.affectedRows == 1) {
        var description = req.body.evidencia_descripcion;
        if(description != '' || req.files.length > 0) {
            var files = '';
            for (var i = 0; i < req.files.length; i++) {
                if(i == 0) {
                    files += req.files[i].originalname;
                } else {
                    files += ',' + req.files[i].originalname;
                }
            }
            if(description == '')
                description = 'Sin comentarios';
            mysql.evidence.registerEvidences(req.evicorrelativo, description, files, req.comcorrelativo, req.session.user.t_company_ruc);
        }
    }
    req.session.notification = computil.notification('success','Registro Satisfactorio','Se registró el compromiso Nro. ' + req.comcorrelativo);
    //res.redirect('/secure/commitlist');
    res.send('ok');
    auditlog(req);
});

router.post('/commitdelete', function(req, res){
    var nrocorrelativo = req.body.nrocorrelativo;
    req.idaffected = nrocorrelativo; // Para auditoría
    var result = mysql.commitment.deleteCommitmentByCorrelative(req.session.user.t_company_ruc,nrocorrelativo);
    req.session.notification = computil.notification('success','Eliminación existosa','Se eliminó el compromiso');
    res.redirect('/secure/commitlist');
    auditlog(req);
});
router.post('/monitdelete', function(req, res){
    var nrocorrelativo = req.body.nrocorrelativo;
    req.idaffected = nrocorrelativo; // Para auditoría
    var result = mysql.monitor.deleteMonitorByCorrelative(req.session.user.t_company_ruc,nrocorrelativo);
    req.session.notification = computil.notification('success','Eliminación existosa','Se eliminó el monitoreo');
    res.redirect('/secure/monitlist');
    auditlog(req);
});

router.post('/emailToSoporte', function(req, res, next){
    var userid = req.session.user.userid;
    var reception = mysql.user.getEmailByID(userid);
    var inbox = 'eschulergodo7@gmail.com';
    var emailtext = req.body.email;

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
        res.redirect('/secure/home');
        auditlog(req);
    } catch(e) {
        next(e);
    }

});

router.post('/commitupdate/:nrocorrelativo', function(req,res,next){
    req.type='commitment';
    req.comcorrelativo = req.params.nrocorrelativo;
    req.correlativo = req.params.nrocorrelativo;  // para object storage
    req.idaffected = req.params.nrocorrelativo; // Para auditoría
    var correlativoevi = mysql.evidence.getNextCorrelative(req.session.user.t_company_ruc, req.comcorrelativo); // correlativo para evidencias
    req.evicorrelativo = correlativoevi[0].correlativo;
    next();
},uploadEvidences.array('evidencias'),function(req, res){
    var comdata = req.body.comdata.split(',');
    var cominput = [];
    var nrocorrelativo = req.body.nrocorrelativo;

    for (var i = 0; i < comdata.length; i++) {
        if(comdata[i] != 'evidencias' && comdata[i] != 'evidencia_descripcion' ) {
            var item = comdata[i];
            if (!item) {
                cominput.push(null);
            } else {
                if (computil.checktype(req.body[item]) == 'date') {
                    cominput.push(dateFormat((new Date(req.body[item]),'yyyy-mm-dd')));
                } else if(item.startsWith('fecha')) {
                    var fecha = req.body[item];
                    var fecarray = fecha.split('/');
                    cominput.push(fecarray[2] + '-' + fecarray[1] + '-' + fecarray[0]);
                } else {
                    if (req.body[item] == 'CM28' ||req.body[item] == 'CM29'||req.body[item] == 'CM30'||req.body[item] == 'CM31' ){
                        cominput.push('Si');
                    } else {
                        //cominput.push(item);
                        cominput.push(req.body[item]);
                    }
                }

            }
        }
    }
    cominput.push(req.session.user.t_company_ruc);
    cominput.push(nrocorrelativo);
    mysql.commitment.updateSingleCommitment(comdata,cominput);
    
    // Registrando evidencias
    if(comdata.includes('evidencia_descripcion') || comdata.includes('evidencias')) {

        var description = req.body.evidencia_descripcion;
        if(description != '' || req.files.length > 0) {
            var files = '';
            for (var i = 0; i < req.files.length; i++) {
                if(i == 0) {
                    files += req.files[i].originalname;
                } else {
                    files += ',' + req.files[i].originalname;
                }
            }
            if(description == '')
                description = 'Sin comentarios';
            mysql.evidence.registerEvidences(req.evicorrelativo, description, files, nrocorrelativo, req.session.user.t_company_ruc);
        }
    }
    req.session.notification = computil.notification('success','Actualización exitosa','Se actualizó el compromiso Nro. ' + req.comcorrelativo);
    res.send('ok');
    //res.redirect('/secure/commitlist');
    // Para auditoría
    var configtypes = mysql.commitment.getCommitmentTypesMin();
    var tmp = '';
    for (var i = 0; i < comdata.length; i++) {
        for (var j = 0; j < configtypes.length; j++) {
            if((comdata[i] == configtypes[j].columnasoc) && (i < (comdata.length - 1))) {
                tmp += configtypes[j].name + ',';
            } else if((comdata[i] == configtypes[j].columnasoc) && (i == (comdata.length - 1))) {
                tmp += configtypes[j].name;
            }
        }
    }
    console.log("tmp:",tmp);
    req.fieldaffected = tmp;
    auditlog(req);
    // Fin auditoria
});

router.post('/monitregister', function(req, res, next){
    // obteniendo correlativo
    req.type = 'monitor';
    var correlativomon = mysql.monitor.getNextCorrelative(req.session.user.t_company_ruc); // correlativo para compromisos
    req.moncorrelativo = correlativomon[0].correlativo;
    req.correlativo = correlativomon[0].correlativo;  // para object storage
    req.idaffected = correlativomon[0].correlativo; // Para auditoría
    //var correlativoevi = mysql.evidence.getNextCorrelative(req.session.user.t_company_ruc, req.comcorrelativo); // correlativo para evidencias
    req.evicorrelativo = 1;
    next();
},uploadEvidences.array('evidencias'),function(req, res){
    var monconfig = mysql.monitor.getMonitorConfigByRuc(req.session.user.t_company_ruc);
    var mondata = [];
    mondata.push(req.session.user.t_company_ruc);

    for (var i = 0; i < monconfig.length; i++) {
        if(monconfig[i].columnasoc != 'evidencias') {
            if (monconfig[i].columnasoc == 'nrocorrelativo') {
                mondata.push(req.moncorrelativo);
            } else {
                var item = req.body[monconfig[i].columnasoc];
                if (!item) {
                    mondata.push(null);
                } else {
                    if (computil.checktype(item) == 'date') {
                        mondata.push(dateFormat((new Date(item),'yyyy-mm-dd')));
                    } else if(monconfig[i].columnasoc.startsWith('fecha')) {
                        var fecarray = item.split('/');
                        mondata.push(fecarray[2] + '-' + fecarray[1] + '-' + fecarray[0]);
                    } else {
                        if (monconfig[i].t_monitor_config_id == 'MN31' || monconfig[i].t_monitor_config_id == 'MN32'||monconfig[i].t_monitor_config_id == 'MN33'||monconfig[i].t_monitor_config_id == 'MN34'){
                            mondata.push('Si');
                        }
                        else {
                            mondata.push(item);
                        }
                    }
                }

            }
        }
    }
    mondata.push(req.session.user.userid);
    var result = mysql.monitor.createSingleMonitor(monconfig, mondata);
    if(result.affectedRows == 1) {
        var description = req.body.evidencia_descripcion;
        if(description != '' || req.files.length > 0) {
            var files = '';
            for (var i = 0; i < req.files.length; i++) {
                if(i == 0) {
                    files += req.files[i].originalname;
                } else {
                    files += ',' + req.files[i].originalname;
                }
            }
            if(description == '')
                description = 'Sin comentarios';
            mysql.evidence.registerEvidencesMonit(req.evicorrelativo, description, files, req.moncorrelativo, req.session.user.t_company_ruc);
        }
    }
    req.session.notification = computil.notification('success','Registro Satisfactorio','Se registró el monitoreo Nro. ' + req.moncorrelativo);
    //res.redirect('/secure/monitlist');
    res.send('ok');
    auditlog(req);
});

router.post('/commitdelete', function(req, res){
    var nrocorrelativo = req.body.nrocorrelativo;
    req.idaffected = nrocorrelativo; // Para auditoría
    var result = mysql.commitment.deleteCommitmentByCorrelative(req.session.user.t_company_ruc,nrocorrelativo);
    req.session.notification = computil.notification('success','Eliminación existosa','Se eliminó el compromiso');
    res.redirect('/secure/commitlist');
    auditlog(req);
});

router.post('/monitupdate/:nrocorrelativo', function(req,res,next){
    req.type='monitor';
    req.moncorrelativo = req.params.nrocorrelativo;
    req.correlativo = req.params.nrocorrelativo; // para object storage
    req.idaffected = req.params.nrocorrelativo; // Para auditoría
    var correlativoevi = mysql.evidence.getNextCorrelativeMonit(req.session.user.t_company_ruc, req.moncorrelativo); // correlativo para evidencias
    req.evicorrelativo = correlativoevi[0].correlativo;
    next();
},uploadEvidences.array('evidencias'),function(req, res){
    var mondata = req.body.mondata.split(',');
    var moninput = [];
    var nrocorrelativo = req.body.nrocorrelativo;

    for (var i = 0; i < mondata.length; i++) {
        if(mondata[i] != 'evidencias' && mondata[i] != 'evidencia_descripcion' ) {
            var item = mondata[i];
            if (!item) {
                moninput.push(null);
            } else {
                if (computil.checktype(req.body[item]) == 'date') {
                    moninput.push(dateFormat((new Date(req.body[item]),'yyyy-mm-dd')));
                } else if(item.startsWith('fecha')) {
                    var fecha = req.body[item];
                    var fecarray = fecha.split('/');
                    moninput.push(fecarray[2] + '-' + fecarray[1] + '-' + fecarray[0]);
                } else {
                    if (req.body[item] == 'MN31' ||req.body[item] == 'MN32'||req.body[item] == 'MN33'||req.body[item] == 'MN34'){
                        moninput.push('Si');
                    } else {
                        //cominput.push(item);
                        moninput.push(req.body[item]);
                    }
                }

            }
        }
    }
    moninput.push(req.session.user.t_company_ruc);
    moninput.push(nrocorrelativo);
    mysql.monitor.updateSingleMonitor(mondata,moninput);
    
    // Registrando evidencias
    if(mondata.includes('evidencia_descripcion') || mondata.includes('evidencias')) {

        var description = req.body.evidencia_descripcion;
        if(description != '' || req.files.length > 0) {
            var files = '';
            for (var i = 0; i < req.files.length; i++) {
                if(i == 0) {
                    files += req.files[i].originalname;
                } else {
                    files += ',' + req.files[i].originalname;
                }
            }
            if(description == '')
                description = 'Sin comentarios';
            mysql.evidence.registerEvidencesMonit(req.evicorrelativo, description, files, nrocorrelativo, req.session.user.t_company_ruc);
        }
    }
    req.session.notification = computil.notification('success','Actualización exitosa','Se actualizó el monitoreo Nro. ' + req.moncorrelativo);
    //res.redirect('/secure/monitlist');
    res.send('ok');
    // Para auditoría
    var configtypes = mysql.monitor.getMonitorTypesMin();
    var tmp = '';
    for (var i = 0; i < mondata.length; i++) {
        for (var j = 0; j < configtypes.length; j++) {
            if((mondata[i] == configtypes[j].columnasoc) && (i < (mondata.length - 1))) {
                tmp += configtypes[j].name + ',';
            } else if((mondata[i] == configtypes[j].columnasoc) && (i == (mondata.length - 1))) {
                tmp += configtypes[j].name;
            }
        }
    }
    console.log("tmp:",tmp);
    req.fieldaffected = tmp;
    auditlog(req);
    // Fin auditoria
});
module.exports = router;

