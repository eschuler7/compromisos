'use strict';

// Middleware de Auditoría
var mysql = require('./mysql');
// Loading Email Library
var compemail = require('../lib/email');
// Loading util library
var computil = require('../lib/computil');

var scheduleJobWeekly = function(req){
  var clients = mysql.batch.getClientsByRUC();
  console.log('clientes  ',clients);
  var htmlRegistrationTemplate = computil.loadEmailTemplate('security_notificationstatus');
  for (var i = 0; i < clients.length; i++) {
    console.log('tamano clients ',clients.length);
    console.log('valor i ',i);
    var users = mysql.batch.getUsersByRuc(clients[i].ruc);
    var totalCommitmentByRuc = mysql.batch.totalCommitmentByRuc(clients[i].ruc);
    var getCommitmentUncomplishedTotal = mysql.batch.getCommitmentUncomplishedTotal(clients[i].ruc);
    var totalMonitorByRuc = mysql.batch.totalMonitorByRuc(clients[i].ruc);
    var getMonitorUncomplishedTotal = mysql.batch.getMonitorUncomplishedTotal(clients[i].ruc);
    console.log('totalCommitmentByRuc  '+clients[i].ruc,totalCommitmentByRuc[0].totalcompromisos);
    console.log('getCommitmentUncomplishedTotal  '+clients[i].ruc,getCommitmentUncomplishedTotal[0].compromisosincumplidostotal);
    console.log('totalMonitorByRuc  '+clients[i].ruc,totalMonitorByRuc[0].totalmonitoreo);
    console.log('getMonitorUncomplishedTotal  '+clients[i].ruc,getMonitorUncomplishedTotal[0].monitoroesincumplidostotal);
    console.log('users  '+clients[i].ruc,users);  
    
    //revisar for no continua con el siguiente ruc
    for (var i = 0; i < users.length; i++) {
      console.log('users  '+users[i].email);  
      
      if(htmlRegistrationTemplate == '') {
        console.log('[/batch]','[util email template]','La plantilla de correo no pudo ser cargada.');
      } else {
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALCOMMIT',totalCommitmentByRuc[0].totalcompromisos);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALCOMMITINCUMP',getCommitmentUncomplishedTotal[0].compromisosincumplidostotal);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALMONIT',totalMonitorByRuc[0].totalmonitoreo);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALMONITINCUMP',getMonitorUncomplishedTotal[0].monitoroesincumplidostotal);
        compemail.sendEmail(users[i].email,'Estatus en NOLAN',htmlRegistrationTemplate);
      }
    }

  }
};

module.exports = scheduleJobWeekly;