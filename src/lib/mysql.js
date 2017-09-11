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
		mysql = vcapServices['compose-for-mysql'][0].credentials;
		connectionOptions = parseDbUrl(mysql.uri);
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
			const result = conn.query('select ruc, companyname, firsttime, tc.cdatetime,count(tu.email) as users from t_company tc left join t_user tu on tc.ruc=tu.t_company_ruc where tc.ruc!=? group by ruc, companyname, firsttime, tc.cdatetime',[ruc]);
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
			const result = conn.query('select * from t_company where ruc=?',[ruc]);
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
			const result = conn.query('select userid, email, tu.name, lastname, t_rol_rolid, tr.name rol_name, tu.cdatetime, tu.udatetime from t_user tu left join t_rol tr on tu.t_rol_rolid=tr.rolid where tu.t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getEmailByID : function(userid) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select email from t_user where userid=?',[userid]);
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
						columns.push("DATE_FORMAT(" + compcomm[i].columnasoc + ",'%d/%m/%Y') as " + compcomm[i].columnasoc);
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
		createCommitment : function(compcomm, comdatatotal) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < compcomm.length; i++) {
				columns.push(compcomm[i].columnasoc);
				values.push('?');
			}
			var dynamicquery = 'insert into t_commitment(ruc,' + columns.toString() + ',cdatetime,udatetime,t_user_userid) values(?,' + values.toString() + ',now(),now(),?)';
			var conn = new mysql(connectionOptions);
			for (var i = 0; i < comdatatotal.length; i++) {
				conn.query(dynamicquery,comdatatotal[i]);
			}
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
		updateSingleCommitment : function(ruc, comdata, cominput,nrocorrelativo) {
			// Dynamic query build
			var columns = [];
			for (var i = 0; i < comdata.length; i++) {
				if(comdata[i] != 'evidencias' && comdata[i] != 'evidencia_descripcion'){
					console.log(comdata[i]);
					columns.push(comdata[i] + '=?');
				}
			}
			cominput.push(ruc);
			cominput.push(nrocorrelativo);
			if (columns.length < 1) {
				var dynamicquery = 'update t_commitment set udatetime=now() where ruc=? and nrocorrelativo=?'
			} 
			else {
				var dynamicquery = 'update t_commitment set '+ columns.toString() + ',udatetime=now() where ruc=? and nrocorrelativo=?'
			}

			var conn = new mysql(connectionOptions);
			conn.query(dynamicquery,cominput);
			conn.dispose();
		},
		getComConfigByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select t_company_ruc,t_commitment_config_id,tco.name,tco.columnasoc from t_company_commitment tcc left join t_commitment_config tco on tcc.t_commitment_config_id=tco.id where t_company_ruc=?',[ruc]);
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
			const result = conn.query('select id, name, columnasoc, mandatory from t_commitment_config');
			conn.dispose();
			return result;
		},
		deleteCommitmentTypes : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_commitment where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		updateCommitmentConfig : function(ruc,compromisos) {
			var initconfig = compromisos;
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company_commitment where t_company_ruc=?',[ruc]);
			if (Array.isArray(initconfig)) {
				console.log('Valores de compromisos Array: ',compromisos,ruc);
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
			const result = conn.query('insert into t_commitment_evidence(id, description,files,cdatetime,t_commitment_nrocorrelativo,t_commitment_ruc) values(?,?,?,now(),?,?)',[evicorrelativo, description, files, comcorrelativo, ruc]);
			conn.dispose();
			return result;
		},
		getEvidences : function(ruc, correlativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select * from t_commitment_evidence where t_commitment_nrocorrelativo=? and t_commitment_ruc=?',[correlativo, ruc]);
			conn.dispose();
			return result;
		},
		getNextCorrelative : function(ruc, comcorrelativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select if(max(id) is null, 1, max(id) + 1) as correlativo from t_commitment_evidence where t_commitment_ruc=? and t_commitment_nrocorrelativo',[ruc]);
			conn.dispose();
			return result;
		},
		registerEvidencesMonit : function(evicorrelativo, description, files, moncorrelativo, ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_monitor_evidence(id, description,files,cdatetime,t_monitor_nrocorrelativo,t_monitor_ruc) values(?,?,?,now(),?,?)',[evicorrelativo, description, files, moncorrelativo, ruc]);
			conn.dispose();
			return result;
		},
		getEvidencesMonit : function(ruc, correlativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select * from t_monitor_evidence where t_monitor_nrocorrelativo=? and t_monitor_ruc=?',[correlativo, ruc]);
			conn.dispose();
			return result;
		},
		getNextCorrelativeMonit : function(ruc, moncorrelativo) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select if(max(id) is null, 1, max(id) + 1) as correlativo from t_monitor_evidence where t_monitor_ruc=? and t_monitor_nrocorrelativo',[ruc]);
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
		createMonitor : function(monconfig, mondatatotal) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < monconfig.length; i++) {
				columns.push(monconfig[i].columnasoc);
				values.push('?');
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
		getMonitorConfigByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select t_company_ruc,t_monitor_config_id,tmc.name,tmc.columnasoc from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getMonitorTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name, columnasoc, mandatory from t_monitor_config');
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
				console.log('Valores de monitoreo Array: ',monitoreo,ruc);
			
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
			const result = conn.query('select id, name, mandatory from t_dashboard_config');
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
				console.log('Valores de dashboard Array: ',initconfig,ruc);
				for (var i = 0; i < initconfig.length; i++) {
					conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig[i]]);
				}
			} else {
				console.log('Valores de dashboard no Array: ',initconfig,ruc);
				conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig]);			
			}
			conn.dispose();
		}
	}
}

module.exports = compromisosdb;