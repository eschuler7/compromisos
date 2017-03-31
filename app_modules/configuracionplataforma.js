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

var qActualizartextoSms = "UPDATE PARM.TBL_CONFIGURACION_PLATAFORMA SET TEXTO_SMS=";
function actualizarTextoSms(texto,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizartextoSms + "'" + texto + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qActualizartextoLlamada = "UPDATE PARM.TBL_CONFIGURACION_PLATAFORMA SET TEXTO_LLAMADA=";
function actualizarTextoLlamada(texto,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizartextoLlamada + "'" + texto + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qActualizartextoEmail = "UPDATE PARM.TBL_CONFIGURACION_PLATAFORMA SET TEXTO_CORREO=";
function actualizarTextoEmail(texto,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizartextoEmail + "'" + texto + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

module.exports.obtenerConfiguracionPlataforma = obtenerConfiguracionPlataforma;
module.exports.actualizarTextoSms = actualizarTextoSms;
module.exports.actualizarTextoLlamada = obtenerConfiguracionPlataforma;
module.exports.actualizarTextoEmail = actualizarTextoEmail;