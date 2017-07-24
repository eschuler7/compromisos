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
			const result = conn.query("insert into t_company values(?,?,?,now(),now())",[ruc, companyname, email]);
			conn.dispose();
			return result;
		},
		deleteCompanyByRuc : function(ruc){
			var conn = new mysql(connectionOptions);
			const result = conn.query("delete from t_company where ruc=?",[ruc]);
			conn.dispose();
			return result;
		},
		updateCompanyByRuc : function(ruc, companyname, email) {
			var conn = new mysql(connectionOptions);
			const result = conn.query("update t_company set companyname=?,email=?,udatetime=now() where ruc=?",[companyname, email, ruc]);
			conn.dispose();
			return result;
		}
	},
	user : {
		createUser : function(userid, password, name, lastname, ruc, rol){
			var conn = new mysql(connectionOptions);
			const result = conn.query("insert into t_user values(?,?,?,?,?,?,now(),now())",[userid, password, name, lastname, ruc, rol]);
			conn.dispose();
			return result;
		},
		deleteUserById : function(ruc, userid) {

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