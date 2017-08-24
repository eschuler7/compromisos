'use strict';
// Loading mysql library
var mysql = require('sync-mysql');

//Loading config library
var config = require('./config');

var connectionOptions = {
	host: config().mysql.host,
	port: config().mysql.port,
	user: config().mysql.user,
	database: config().mysql.database,
	password: config().mysql.password,
	debug: false
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
		getUsersByRuc : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select userid, email, tu.name, lastname, t_rol_rolid, tr.name rol_name, tu.cdatetime, tu.udatetime from t_user tu left join t_rol tr on tu.t_rol_rolid=tr.rolid where tu.t_company_ruc=?',[ruc]);
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
		createCommitment : function(ruc, compcomm, comdata) {
			// Dynamic query build
			var columns = [];
			var values = [];
			for (var i = 0; i < compcomm.length; i++) {
				columns.push(compcomm[i].columnasoc);
				values.push('?');
			}
			var dynamicquery = 'insert into t_commitment(ruc,' + columns.toString() + ',cdatetime,udatetime,t_user_userid) values(?,' + values.toString() + ',?,?,?	)';
			var conn = new mysql(connectionOptions);
			const result = conn.query(dynamicquery,comdata);
			conn.dispose();
			return result;
		},
		deleteCommitment : function () {

		},
		updateCommitment : function() {

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
			const result = conn.query('select id, name from t_commitment_config');
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
		}
	},
	monitor : {
		getMonitConfigByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select t_company_ruc,t_monitor_config_id,tmc.name from t_company_monitor tcm left join t_monitor_config tmc on tcm.t_monitor_config_id=tmc.id where t_company_ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getMonitorTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name from t_monitor_config');
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
			const result = conn.query('select id, name from t_dashboard_config');
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