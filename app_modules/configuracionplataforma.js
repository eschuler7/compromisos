'use strict';
var ibmdb = require("ibm_db");
var dbConn = require("./db2.js");

var connString = dbConn.initDBconnection();

var options = { connectTimeout : 20 }; // time out de 20 segundos para todas las conexiones sincronas

var qObtenerConfiguracionPlataforma = "SELECT * FROM PARM.TBL_CONFIGURACION_PLATAFORMA WHERE RUC=";
function obtenerConfiguracionPlataforma(ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerConfiguracionPlataforma + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

module.exports.obtenerConfiguracionPlataforma = obtenerConfiguracionPlataforma;