'use strict';
// Loading mysql library
var mysql = require('sync-mysql');
var parseDbUrl = require("parse-database-url");
//Loading config library
var config = require('./config');

var connectionOptions;
if(process.env.VCAP_SERVICES) {
	var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
	if(vcapServices['compose-for-mysql']){
		var mysqlcon = vcapServices['compose-for-mysql'][0].credentials;
		connectionOptions = parseDbUrl(mysqlcon.uri);
	}
} else {
	connectionOptions = {
		host: config().mysql.host,
		port: config().mysql.port,
		user: config().mysql.user,
		database: config().mysql.database,
		password: config().mysql.password,
		debug: config().mysql.debug
	}
}

var compromisosdb = {
	company : {
		listCompanies : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("select ruc, companyname, firsttime, DATE_FORMAT(tc.cdatetime,'%d/%m/%Y') as cdatetime,count(tu.email) as users from t_company tc left join t_user tu on tc.ruc=tu.t_company_ruc where tc.ruc!=? group by ruc, companyname, firsttime, tc.cdatetime",[ruc]);
			conn.dispose();
			return result;
		},
		validateRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select ruc from t_company where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		createCompany : function(ruc, companyname) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_company(ruc,companyname,firsttime,cdatetime,udatetime) values(?,?,1,now(),now())',[ruc, companyname]);
			conn.dispose();
			return result;
		},
		deleteCompanyByRuc : function(ruc){
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		updateCompanyByRuc : function(ruc, companyname, unidad, proyecto) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_company set companyname=?,unidad=?,proyecto=?,udatetime=now() where ruc=?',[companyname, unidad, proyecto, ruc]);
			conn.dispose();
			return result;
		},
		updateFirstTime : function(ruc, firsttime){
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_company set firsttime=?,udatetime=now() where ruc=?',[firsttime, ruc]);
			conn.dispose();
			return result;
		},
		getCompanyByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("select ruc, companyname, unidad, proyecto, firsttime, DATE_FORMAT(cdatetime,'%d/%m/%Y') as cdatetime, DATE_FORMAT(udatetime,'%d/%m/%Y') as udatetime from t_company where ruc=?",[ruc]);
			conn.dispose();
			return result;
		}
	},
	user : {
		createUser : function(userid, password, email, name, lastname, ruc, rol, changepwd){
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_user values(?,?,?,?,?,?,?,?,now(),now())',[userid, password, email, name, lastname, ruc, rol, changepwd]);
			conn.dispose();
			return result;
		},
		deleteUserById : function(ruc, userid) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_user where t_company_ruc=? and userid=?',[ruc, userid]);
			conn.dispose();
			return result;
		},
		deleteAllUserById : function(ruc, userid) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_user where t_company_ruc=? and userid not like ?',[ruc, userid]);
			conn.dispose();
			return result;
		},
		deleteUsersByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("delete from t_user where t_company_ruc=?",[ruc]);
			conn.dispose();
			return result;
		},
		login : function(userid, password) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select tu.userid, tu.name, tu.lastname, tc.firsttime, tu.t_company_ruc, tc.companyname, tu.t_rol_rolid, changepwd, tc.unidad, tc.proyecto from t_user tu left join t_company tc on tu.t_company_ruc=tc.ruc where userid=? and password=?',[userid, password]);
			conn.dispose();
			return result;
		},
		validateUserId : function(userid) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select userid from t_user where userid=?',[userid]);
			conn.dispose();
			return result;
		},
		resetPassword : function(userid, password, newpassword) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_user set password=?,changepwd=0 where userid=? and password=?',[newpassword, userid, password]);
			conn.dispose();
			return result;
		},
		resetForgotPassword : function(userid, password) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_user set password=?,changepwd=1,udatetime=now() where userid=?',[password,userid]);
			conn.dispose();
			return result;
		},
		getUsersByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("select userid, email, tu.name, lastname, tr.name rol_name, DATE_FORMAT(tu.cdatetime,'%d/%m/%Y') as cdatetime, DATE_FORMAT(tu.udatetime,'%d/%m/%Y') as udatetime from t_user tu left join t_rol tr on tu.t_rol_rolid=tr.rolid where tu.t_company_ruc=?",[ruc]);
			conn.dispose();
			return result;
		},
		getEmailByID : function(userid) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select email from t_user where userid=?',[userid]);
			conn.dispose();
			return result;
		},
		getCountUsersByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(userid) as totalusers from t_user where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		}
	},
	rol : {
		listRoles : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select * from t_rol');
			conn.dispose();
			return result;
		}
	},
	commitment : {
		getCommitmentsByRuc : function(ruc, compcomm) {
			var columns = [];
			for (var i = 0; i < compcomm.length; i++) {
				if (compcomm[i].columnasoc != 'evidencias')
					if(compcomm[i].columnasoc.startsWith('fecha')) {
						columns.push("date_format(" + compcomm[i].columnasoc + ",'%d/%m/%Y') as " + compcomm[i].columnasoc);
					} else if(compcomm[i].columnasoc == 'contorigcomp' || compcomm[i].columnasoc == 'resumencomp' || compcomm[i].columnasoc == 'antecedentes' || compcomm[i].columnasoc == 'detalleaccion' || compcomm[i].columnasoc == 'correosnotificacion' || compcomm[i].columnasoc == 'comentarios' || compcomm[i].columnasoc == 'referencialegal'){
						columns.push('if(char_length(' + compcomm[i].columnasoc + ')>20, concat(substring(' + compcomm[i].columnasoc + ',1,20)," ..."),' + compcomm[i].columnasoc + ') as ' + compcomm[i].columnasoc);
					} else {
						columns.push(compcomm[i].columnasoc);
					}
			}
			var dynamicquery = 'select ' + columns.toString() + ' from t_commitment where ruc=?';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentsByRucForExport : function(ruc, compcomm) {
			var columns = [];
			for (var i = 0; i < compcomm.length; i++) {
				if (compcomm[i].columnasoc != 'evidencias')
					if(compcomm[i].columnasoc.startsWith('fecha')) {
						columns.push("date_format(" + compcomm[i].columnasoc + ",'%d/%m/%Y') as " + compcomm[i].columnasoc);
					} else {
						columns.push(compcomm[i].columnasoc);
					}
			}
			var dynamicquery = 'select ' + columns.toString() + ' from t_commitment where ruc=?';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentByCorrelative : function(ruc, compcomm, nrocorrelativo) {
			var columns = [];
			for (var i = 0; i < compcomm.length; i++) {
				if (compcomm[i].columnasoc != 'evidencias')
					if(compcomm[i].columnasoc.startsWith('fecha')) {
						columns.push("DATE_FORMAT(" + compcomm[i].columnasoc + ",'%d/%m/%Y') as " + compcomm[i].columnasoc);
					} else {
						columns.push(compcomm[i].columnasoc);
					}
			}
			var dynamicquery = 'select ' + columns.toString() + ' from t_commitment where ruc=? and nrocorrelativo=?';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,[ruc,nrocorrelativo]);
			conn.dispose();
			return result;
		},
		createCommitment : function(comconfig, comdatatotal) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < comconfig.length; i++) {
				if(comconfig[i].columnasoc != 'evidencias') {
					columns.push(comconfig[i].columnasoc);
					values.push('?');
				}
			}
			var dynamicquery = 'insert into t_commitment(ruc,' + columns.toString() + ',cdatetime,udatetime,t_user_userid) values(?,' + values.toString() + ',now(),now(),?)';
			var conn = new mysql(connectionOptions);
			console.log(new Date());
			for (var i = 0; i < comdatatotal.length; i++) {
				conn.query(dynamicquery,comdatatotal[i]);
			}
			console.log(new Date());
			conn.dispose();
		},
		createSingleCommitment : function(compcomm, comdata) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < compcomm.length; i++) {
				if(compcomm[i].columnasoc != 'evidencias'){
					columns.push(compcomm[i].columnasoc);
					values.push('?');
				}
			}
			var dynamicquery = 'insert into t_commitment(ruc,' + columns.toString() + ',cdatetime,udatetime,t_user_userid) values(?,' + values.toString() + ',now(),now(),?)';
			var conn = new mysql(connectionOptions);
			var result = conn.query(dynamicquery,comdata);
			conn.dispose();
			return result;
		},
		deleteCommitmentByCorrelative : function (ruc,nrocorrelativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_commitment where ruc=? and nrocorrelativo=?;',[ruc, nrocorrelativo]);
			conn.dispose();
			return result;
		},
		updateSingleCommitment : function(comdata, cominput) {
			// Dynamic query build
			var columns = [];
			for (var i = 0; i < comdata.length; i++) {
				if(comdata[i] != 'evidencias' && comdata[i] != 'evidencia_descripcion'){
					columns.push(comdata[i] + '=?');
				}
			}
			
			if (columns.length < 1) {
				var dynamicquery = 'update t_commitment set udatetime=now() where ruc=? and nrocorrelativo=?'
			} else {
				var dynamicquery = 'update t_commitment set '+ columns.toString() + ',udatetime=now() where ruc=? and nrocorrelativo=?'
			}

			var conn = new mysql(connectionOptions);
			conn.query(dynamicquery,cominput);
			conn.dispose();
		},
		getComConfigByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select t_commitment_config_id,tco.name,tco.columnasoc from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		//Varía de getComConfigByRuc en que no tiene campo name ni ruc ni id, solo será usado para armar la query dinamica para el insert
		getComConfigByRucForInsert : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select tco.columnasoc from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name, description, columnasoc, mandatory from t_commitment_config');
			conn.dispose();
			return result;
		},
		getCommitmentTypesMin : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select name, columnasoc from t_commitment_config');
			conn.dispose();
			return result;
		},
		deleteCommitmentTypes : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_commitment where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		deleteAllCommitments : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_commitment where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		updateCommitmentConfig : function(ruc,compromisos) {
			var initconfig = compromisos;
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_commitment where t_company_ruc=?',[ruc]);
			if (Array.isArray(initconfig)) {
				for (var i = 0; i < initconfig.length; i++) {
					conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,initconfig[i]]);
				}
			} else {
				conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,initconfig]);
			}
			conn.dispose();
		},
		getNextCorrelative : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select if(max(nrocorrelativo) is null, 1, max(nrocorrelativo) + 1) as correlativo from t_commitment where ruc=?',[ruc]);
			conn.dispose();
			return result;
		}
	},
	evidence : {
		registerEvidences : function(evicorrelativo, description, files, comcorrelativo, ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_commitment_evidence(t_commitment_ruc, t_commitment_nrocorrelativo, id, description,files,cdatetime) values(?,?,?,?,?,now())',[ruc, comcorrelativo, evicorrelativo, description, files]);
			conn.dispose();
			return result;
		},
		getEvidences : function(ruc, correlativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("select id,description,files,DATE_FORMAT(cdatetime,'%d/%m/%Y') as cdatetime from t_commitment_evidence where t_commitment_nrocorrelativo=? and t_commitment_ruc=?",[correlativo, ruc]);
			conn.dispose();
			return result;
		},
		getNextCorrelative : function(ruc, comcorrelativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select if(max(id) is null, 1, max(id) + 1) as correlativo from t_commitment_evidence where t_commitment_ruc=? and t_commitment_nrocorrelativo=?',[ruc, comcorrelativo]);
			conn.dispose();
			return result;
		},
		registerEvidencesMonit : function(evicorrelativo, description, files, moncorrelativo, ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_monitor_evidence(t_monitor_ruc, t_monitor_nrocorrelativo, id, description,files,cdatetime) values(?,?,?,?,?,now())',[ruc, moncorrelativo, evicorrelativo, description, files]);
			conn.dispose();
			return result;
		},
		getEvidencesMonit : function(ruc, correlativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("select id,description,files,DATE_FORMAT(cdatetime,'%d/%m/%Y') as cdatetime from t_monitor_evidence where t_monitor_nrocorrelativo=? and t_monitor_ruc=?",[correlativo, ruc]);
			conn.dispose();
			return result;
		},
		getNextCorrelativeMonit : function(ruc, moncorrelativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select if(max(id) is null, 1, max(id) + 1) as correlativo from t_monitor_evidence where t_monitor_ruc=? and t_monitor_nrocorrelativo=?',[ruc, moncorrelativo]);
			conn.dispose();
			return result;
		}
	},
	monitor : {
		getMonitorsByRuc : function(ruc, monconf) {
			var columns = [];
			for (var i = 0; i < monconf.length; i++) {
				if (monconf[i].columnasoc != 'evidencias') {
					if(monconf[i].columnasoc.startsWith('fecha')) {
						columns.push("DATE_FORMAT(" + monconf[i].columnasoc + ",'%d/%m/%Y') as " + monconf[i].columnasoc);
					} else if(monconf[i].columnasoc == 'aspecasoc' || monconf[i].columnasoc == 'textliteral' || monconf[i].columnasoc == 'antecmonitoreo' || monconf[i].columnasoc == 'detalleaccion' || monconf[i].columnasoc == 'notificacion' || monconf[i].columnasoc == 'referenciatecnica' || monconf[i].columnasoc == 'comentarios'){
						columns.push('if(char_length(' + monconf[i].columnasoc + ')>20, concat(substring(' + monconf[i].columnasoc + ',1,20)," ..."),' + monconf[i].columnasoc + ') as ' + monconf[i].columnasoc);
					} else {
						columns.push(monconf[i].columnasoc);
					}
				}
			}
			var dynamicquery = 'select ' + columns.toString() + ' from t_monitor where ruc=?';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,[ruc]);
			conn.dispose();
			return result;
		},
		getNextCorrelative : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select if(max(nrocorrelativo) is null, 1, max(nrocorrelativo) + 1) as correlativo from t_monitor where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getMonitorByCorrelative : function(ruc, monconf, nrocorrelativo) {
			var columns = [];
			for (var i = 0; i < monconf.length; i++) {
				if (monconf[i].columnasoc != 'evidencias')
					if(monconf[i].columnasoc.startsWith('fecha')) {
						columns.push("DATE_FORMAT(" + monconf[i].columnasoc + ",'%d/%m/%Y') as " + monconf[i].columnasoc);
					} else {
						columns.push(monconf[i].columnasoc);
					}
			}
			var dynamicquery = 'select ' + columns.toString() + ' from t_monitor where ruc=? and nrocorrelativo=?';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,[ruc,nrocorrelativo]);
			conn.dispose();
			return result;
		},
		deleteMonitorByCorrelative : function (ruc,nrocorrelativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_monitor where ruc=? and nrocorrelativo=?;',[ruc, nrocorrelativo]);
			conn.dispose();
			return result;
		},
		deleteAllMonitors : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_monitor where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		createMonitor : function(monconfig, mondatatotal) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < monconfig.length; i++) {
				if(monconfig[i].columnasoc != 'evidencias'){
					columns.push(monconfig[i].columnasoc);
					values.push('?');
				}
			}
			var dynamicquery = 'insert into t_monitor(ruc,' + columns.toString() + ',cdatetime,udatetime,t_user_userid) values(?,' + values.toString() + ',now(),now(),?)';
			var conn = new mysql(connectionOptions);
			for (var i = 0; i < mondatatotal.length; i++) {
				conn.query(dynamicquery,mondatatotal[i]);
			}
			conn.dispose();
		},
		createSingleMonitor : function(monconfig, mondata) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < monconfig.length; i++) {
				if(monconfig[i].columnasoc != 'evidencias'){
					columns.push(monconfig[i].columnasoc);
					values.push('?');
				}
			}
			var dynamicquery = 'insert into t_monitor(ruc,' + columns.toString() + ',cdatetime,udatetime,t_user_userid) values(?,' + values.toString() + ',now(),now(),?)';
			var conn = new mysql(connectionOptions);
			var result = conn.query(dynamicquery,mondata);
			conn.dispose();
			return result;
		},
		updateSingleMonitor : function(mondata, moninput) {
			// Dynamic query build
			var columns = [];
			for (var i = 0; i < mondata.length; i++) {
				if(mondata[i] != 'evidencias' && mondata[i] != 'evidencia_descripcion'){
					columns.push(mondata[i] + '=?');
				}
			}
			if (columns.length < 1) {
				var dynamicquery = 'update t_monitor set udatetime=now() where ruc=? and nrocorrelativo=?'
			} else {
				var dynamicquery = 'update t_monitor set '+ columns.toString() + ',udatetime=now() where ruc=? and nrocorrelativo=?'
			}

			var conn = new mysql(connectionOptions);
			conn.query(dynamicquery,moninput);
			conn.dispose();
		},
		getMonitorConfigByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select t_company_ruc,t_monitor_config_id,tmc.name,tmc.columnasoc from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getMonitorConfigByRucForInsert : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select tmc.columnasoc from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getMonitorTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name, columnasoc,description, mandatory from t_monitor_config');
			conn.dispose();
			return result;
		},
		getMonitorTypesMin : function() { // Only name and columnasoc for auditlog
			var conn = new mysql(connectionOptions);
			const result = conn.query('select name, columnasoc from t_monitor_config');
			conn.dispose();
			return result;
		},
		deleteMonitorTypes : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_monitor where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		updateMonitorConfig : function(ruc,monitoreo) {
			var initconfig = monitoreo;
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_monitor where t_company_ruc=?',[ruc]);

			if (Array.isArray(initconfig)) {
				for (var i = 0; i < initconfig.length; i++) {
					conn.query('insert into t_company_monitor values(?,?)',[ruc,initconfig[i]]);
				}
			} else {
				console.log('Valores de monitoreo: ',monitoreo,ruc);
				conn.query('insert into t_company_monitor values(?,?)',[ruc,initconfig]);
			}
			conn.dispose();
		}
	},
	dashboard : {
		getDashboardTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name, description, mandatory from t_dashboard_config');
			conn.dispose();
			return result;
		},
		getDashboardConfigByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select t_company_ruc,t_dashboard_config_id,tdc.name from t_company_dashboard tcd left join t_dashboard_config tdc on tcd.t_dashboard_config_id=tdc.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		deleteDashboardTypes : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_dashboard where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		updateDashboardConfig : function(ruc,dashboard) {
			var initconfig = dashboard;
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_dashboard where t_company_ruc=?',[ruc]);
			if (Array.isArray(initconfig)) {
				for (var i = 0; i < initconfig.length; i++) {
					conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig[i]]);
				}
			} else {
				conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig]);			
			}
			conn.dispose();
		}
	},
	auditlog : {
		registerAuditLog : function(date, ruc, companyname, sessionid, userid, router, action, idaffected, fieldaffected) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_audit_log values(?,?,?,?,?,?,?,?,?)',[date, ruc, companyname, sessionid, userid, router, action, idaffected, fieldaffected]);
			conn.dispose();
			return result;
		},
		getAuditLogs : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query("select DATE_FORMAT(datetime,'%d/%m/%Y %T') as datetime,ruc,companyname,sessionid,userid,router,action,idaffected,fieldaffected from t_audit_log");
			conn.dispose();
			return result;
		}
	},
	batch : {
		totalCommitmentByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(nrocorrelativo) as totalcompromisos from t_commitment where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		totalCommitmentBySeverity : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select criticidad, count(criticidad) as totalcompromisoscriticidad from t_commitment where ruc=? group by criticidad order by criticidad asc',[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentsIncompletedByRuc : function(ruc, comconfig) {
			//falta modificar!!!!!
			var columns = [];
			for (var i = 0; i < comconfig.length; i++) {
				if (comconfig[i].columnasoc != 'evidencias')
					if(comconfig[i].columnasoc.startsWith('fecha')) {
						columns.push("DATE_FORMAT(" + comconfig[i].columnasoc + ",'%d/%m/%Y') as " + comconfig[i].columnasoc);
					} else {
						columns.push(comconfig[i].columnasoc);
					}
			}
			var dynamicquery = 'select ' + columns.toString() + ' from t_commitment where ruc=?';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentByStatusClosed : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(estadocumplimiento) as totalcompromisoscerrados from t_commitment where ruc=? and estadocumplimiento = "Cerrado"',[ruc]);
			conn.dispose();
			return result;
		},

		getCommitmentRequiereAction : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(accioncompromiso) as compromisoreqaccion from t_commitment where ruc=? and accioncompromiso = "Si"',[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentUncomplishedWithAction : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(estadocumplimiento) as compromisoincumpconaccion  from t_commitment where ruc=? and estadocumplimiento = "Vencido" and detalleaccion IS NOT NULL',[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentWithoutAction : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(nrocorrelativo) as compromisosinaccion from t_commitment where ruc=? and detalleaccion IS NULL',[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentUncomplishedTotal : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(estadocumplimiento) as compromisosincumplidostotal from t_commitment where ruc=? and estadocumplimiento = "Vencido"',[ruc]);
			conn.dispose();
			return result;
		},
		getCommitmentUncomplishedBySeverity : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select criticidad, count(criticidad) as compromisosincumpxcriticidad from t_commitment where ruc=? and estadocumplimiento = "Vencido" group by criticidad order by criticidad asc',[ruc]);
			conn.dispose();
			return result;
		},
		totalMonitorByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select count(nrocorrelativo) as totalmonitoreo from t_monitor where ruc=?',[ruc]);
			conn.dispose();
			return result;
		}
	},
	platformconfig : {
		getPlatformConfig : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select configid, configname, configvalue from t_nolan_config');
			conn.dispose();
			return result;
		},
		updateSupportEmail : function(emaillist) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("update t_nolan_config set configvalue=? where configid='NC01'",[emaillist]);
			conn.dispose();
		}
	}
}

module.exports = compromisosdb;