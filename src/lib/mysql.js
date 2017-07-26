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
	password: config().mysql.password
}

var compromisosdb = {
	company : {
		listCompanies : function() {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select * from t_company');
			conn.dispose();
			return result;
		},
		createCompany : function(ruc, companyname, email) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_company values(?,?,?,now(),now())',[ruc, companyname, email]);
			conn.dispose();
			return result;
		},
		deleteCompanyByRuc : function(ruc){
			var conn = new mysql(connectionOptions);
			const result = conn.query('delete from t_company where ruc=?',[ruc]);
			conn.dispose();
			return result;
		},
		updateCompanyByRuc : function(ruc, companyname, email) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('update t_company set companyname=?,email=?,udatetime=now() where ruc=?',[companyname, email, ruc]);
			conn.dispose();
			return result;
		}
	},
	user : {
		createUser : function(userid, password, name, lastname, ruc, rol){
			var conn = new mysql(connectionOptions);
			const result = conn.query('insert into t_user values(?,?,?,?,?,?,now(),now())',[userid, password, name, lastname, ruc, rol]);
			conn.dispose();
			return result;
		},
		deleteUserById : function(ruc, userid) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('lete from t_user where ruc=? and userid=?',[ruc, userid]);
			conn.dispose();
			return result;
		},
		deleteUsersByRuc : function(ruc) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("delete from t_user where ruc=?",[ruc]);
			conn.dispose();
			return result;
		},
		login : function(ruc, userid, password) {
			var conn = new mysql(connectionOptions);
			const result = conn.query('select userid, name, lastname, t_company_ruc, tc.companyname, t_rol_rolid from t_user tu left join t_company tc on tu.t_company_ruc=tc.ruc where tu.t_company_ruc=? and userid=? and password=?',[ruc, userid, password]);
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

		}
	}
}

module.exports = compromisosdb;