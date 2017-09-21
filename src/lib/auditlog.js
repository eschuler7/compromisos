'use strict';

// Middleware de Auditoría
var mysql = require('./mysql');
var dateFormat = require('dateformat');

var auditlog = function(req){
	var date = dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss');
	var originalUrl = req.originalUrl.split('/');
	originalUrl.splice(0,1);
	var router = originalUrl.length == 1 ? 'insecure' : originalUrl[0];
	var action = originalUrl.length == 1 ? originalUrl[0] : originalUrl[1];
	var sessionid = req.sessionID;
	var idaffected = (req.idaffected || null);
	var fieldaffected = (req.fieldaffected || null);
	var ruc;
	var companyname;
	var userid;
	if(req.session && req.session.user) {
		ruc = req.session.user.t_company_ruc;
		companyname = req.session.user.companyname;
		userid = req.session.user.userid;
	} else {
		ruc = req.ruc;
		companyname = req.companyname;
		userid = req.userid;
	}
	mysql.auditlog.registerAuditLog(date, ruc, companyname, sessionid, userid, router, action, idaffected, fieldaffected);
};

module.exports = auditlog;