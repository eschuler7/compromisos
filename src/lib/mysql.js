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
			const result = conn.query("insert into t_company values(?,?,?,NOW(),NOW())",[ruc, companyname, email]);
			conn.dispose();
			return result;
		},
		deleteCompanyByRuc : function(ruc){

		}
	},
	user : {
		createUser : function(){

		},
		deleteUserById : function(ruc, userid) {

		}
	},
	rol : {
		createRol : function() {

		},
		deleteRolById : function() {

		}
	}
}

module.exports = compromisosdb;