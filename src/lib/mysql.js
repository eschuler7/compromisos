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
		},
		getUsersByRuc : function(ruc) {
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
		createCommitment : function() {

		},
		deleteCommitment : function () {

		},
		updateCommitment : function() {

		},
		getCommitmentTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name from t_commitment_config');
			conn.dispose();
			return result;
		},
		initCommitmentConfig : function(ruc,compromisos) {
			var initconfig = compromisos;
			
			if (Array.isArray(initconfig)) {
				console.log('Valores de compromisos Array: ',compromisos,ruc);
				var conn = new mysql(connectionOptions);
				for (var i = 0; i < initconfig.length; i++) {
					if (initconfig[i] == 'CM68') {
						conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,'CM06']);
						conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,'CM07']);
						conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,'CM08']);
					} else {
						conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,initconfig[i]]);
					}
					
				}
			} else {
				console.log('Valores de compromisos: ',compromisos,ruc);
				if (initconfig == 'CM68') {
					conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,'CM06']);
					conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,'CM07']);
					conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,'CM08']);
				} else {
					conn.query('insert into t_company_commitment(t_company_ruc,t_commitment_config_id) values(?,?)',[ruc,initconfig]);
				}
			}
			conn.dispose();
		}
	},
	monitor : {
		getMonitorTypes : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select id, name from t_monitor_config');
			conn.dispose();
			return result;
		},
		initMonitorConfig : function(ruc,monitoreo) {
			var initconfig = monitoreo;
			
			if (Array.isArray(initconfig)) {
				console.log('Valores de monitoreo Array: ',monitoreo,ruc);
				var conn = new mysql(connectionOptions);
				for (var i = 0; i < initconfig.length; i++) {
					if (initconfig[i] == 'MN57') {
						conn.query('insert into t_company_monitor values(?,?)',[ruc,'MN05']);
						conn.query('insert into t_company_monitor values(?,?)',[ruc,'MN06']);
						conn.query('insert into t_company_monitor values(?,?)',[ruc,'MN07']);
					} else {
						conn.query('insert into t_company_monitor values(?,?)',[ruc,initconfig[i]]);
					}
				}
			} else {
				console.log('Valores de monitoreo: ',monitoreo,ruc);
				if (initconfig == 'MN57') {
					conn.query('insert into t_company_monitor values(?,?)',[ruc,'MN05']);
					conn.query('insert into t_company_monitor values(?,?)',[ruc,'MN06']);
					conn.query('insert into t_company_monitor values(?,?)',[ruc,'MN07']);
				} else {
					conn.query('insert into t_company_monitor values(?,?)',[ruc,initconfig]);
				}
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

		},
		initDashboardConfig : function(ruc,dashboard) {
			var initconfig = dashboard;
			if (Array.isArray(initconfig)) {
				console.log('Valores de dashboard Array: ',initconfig,ruc);
				var conn = new mysql(connectionOptions);
				for (var i = 0; i < initconfig.length; i++) {
					conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig[i]]);
				}
			} else {
				console.log('Valores de dashboard no Array: ',initconfig,ruc);
				var conn = new mysql(connectionOptions);
				conn.query('insert into t_company_dashboard values(?,?)',[ruc,initconfig]);				
			}
			conn.dispose();
		}
	}
}

module.exports = compromisosdb;