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
	debug: true
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
		updateCompanyByRuc : function(ruc, companyname) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_company set companyname=?,udatetime=now() where ruc=?',[companyname, ruc]);
			conn.dispose();
			return result;
		},
		updateFirstTime : function(ruc){
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_company set firsttime=0,udatetime=now() where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		getCompanyByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select * from t_company where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		initConfigHeader : function(ruc,companyname,unidad,proyecto) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_company set companyname=?,unidad=?,proyecto=?,udatetime=now() where ruc=?',[companyname,unidad,proyecto,ruc]);
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
			const result = conn.query('delete from t_user where ruc=? and userid=?',[ruc, userid]);
			conn.dispose();
			return result;
		},
		deleteUsersByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("delete from t_user where ruc=?",[ruc]);
			conn.dispose();
			return result;
		},
		login : function(userid, password) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select userid, name, lastname, tc.firsttime, t_company_ruc, tc.companyname, t_rol_rolid, changepwd from t_user tu left join t_company tc on tu.t_company_ruc=tc.ruc where userid=? and password=?',[userid, password]);
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
		createCommitment : function() {

		},
		deleteCommitment : function () {

		},
		updateCommitment : function() {

		},
		initCommitmentConfig : function(ruc,compromisos) {
			var initconfig = compromisos;
			console.log('Valores de compromisos: ',compromisos,ruc);
			var conn = new mysql(connectionOptions);
			for (var i = 0; i < initconfig.length; i++) {
				conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,initconfig[i]]);
			}
			conn.dispose();
		}
	},
	monitor : {
		initMonitorConfig : function(ruc,monitoreo) {
			var initconfig = monitoreo;
			console.log('Valores de monitoreo: ',monitoreo,ruc);
			var conn = new mysql(connectionOptions);
			for (var i = 0; i < initconfig.length; i++) {
				conn.query('insert into t_company_monitor values(?,?)',[ruc,initconfig[i]]);
			}
			conn.dispose();
		}
	},
	dashboard : {
		getDashboardTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select * from t_dashboard_config');
			conn.dispose();
			return result;
		},
		getDashboardConfigByRuc : function(ruc) {

		},
		initDashboardConfig : function(ruc,dashboard) {
			var initconfig = dashboard;
			console.log('Valores de dashboard: ',dashboard,ruc);
			var conn = new mysql(connectionOptions);
			for (var i = 0; i < initconfig.length; i++) {
				conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig[i]]);
			}
			conn.dispose();
		}
	}
}

module.exports = compromisosdb;