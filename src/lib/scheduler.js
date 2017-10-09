'use strict';
// Cron Schedule
var schedule = require('node-schedule');
// Loading db library
var mysql = require('./mysql');
// Loading Email Library
var compemail = require('./email');
// Loading util library
var computil = require('./computil');

var jobs = {
  'Job Prueba Funcional' : function() {
    console.log('Job prueba funcional');
  },
  'Job Reporte de Totales' : function() {
    var clients = mysql.batch.getClientsRuc();
    var htmlRegistrationTemplate = computil.loadEmailTemplate('security_notificationstatus');
    if(htmlRegistrationTemplate == '') {
      console.log('[/batch]','[util email template]','La plantilla de correo no pudo ser cargada.');
    } else {
      for (var i = 0; i < clients.length; i++) {
        var users = mysql.batch.getUsersByRuc(clients[i].ruc);
        var totalCommitmentByRuc = mysql.batch.totalCommitmentByRuc(clients[i].ruc);
        var getCommitmentUncomplishedTotal = mysql.batch.getCommitmentUncomplishedTotal(clients[i].ruc);
        var totalMonitorByRuc = mysql.batch.totalMonitorByRuc(clients[i].ruc);
        var getMonitorUncomplishedTotal = mysql.batch.getMonitorUncomplishedTotal(clients[i].ruc);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALCOMMIT',totalCommitmentByRuc[0].totalcompromisos);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALCOMMITINCUMP',getCommitmentUncomplishedTotal[0].compromisosincumplidostotal);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALMONIT',totalMonitorByRuc[0].totalmonitoreo);
        htmlRegistrationTemplate = htmlRegistrationTemplate.replace('$TOTALMONITINCUMP',getMonitorUncomplishedTotal[0].monitoroesincumplidostotal);
        for (var j = 0; j < users.length; j++) {
          compemail.sendEmail(users[i].email,'Estatus en NOLAN',htmlRegistrationTemplate);          
        }
      }
    }
  }
}

var scheduler = {
  scheduleJob : function(scheduleName, jobName, cronExpression){
    var job = new schedule.Job(scheduleName, jobs[jobName]);
    return job.schedule(cronExpression);
  },
  cancelScheduledJob : function(jobName) {
    return schedule.scheduledJobs[jobName].cancel();
  },
  getScheduledJobs : function() {
    var scheduledjobs = [];
    for(var sheduledjobname in schedule.scheduledJobs) {
      var scheduledjob = {
        name : sheduledjobname,
        job : schedule.scheduledJobs[sheduledjobname].job.name,
        cronExpression: schedule.scheduledJobs[sheduledjobname].pendingInvocations()[0].recurrenceRule._fields,
        nextInvocation: schedule.scheduledJobs[sheduledjobname].nextInvocation()
      }
      scheduledjobs.push(scheduledjob);
    }
    return scheduledjobs;
  },
  getJobs : function() {
    var jobNames = [];
    for(var jobName in jobs){
      jobNames.push(jobName);
    }
    return jobNames;
  }
}

var job2 = new schedule.Job('Prueba Funciontal 2',jobs['Job Prueba Funcional']);
var res2 = job2.schedule('0 23 * * 5');
console.log('El job "',job2.name,'" fue creado?',res2);

module.exports = scheduler;