'use strict';
var ibmdb = require("ibm_db");
var dbConn = require("./db2.js");
var Q = require("q");

var connString = dbConn.initDBconnection();
var schema = dbConn.getSchema();

var options = { connectTimeout : 20 }; // time out de 20 segundos para todas las conexiones sincronas

var qRegistrarReclutamiento = "INSERT INTO " + schema + ".TBL_REGISTRO_RECLUTAMIENTO(ID,RESPONSABLE,PUESTO,NOMBRES,APELLIDO_PATERNO,APELLIDO_MATERNO,CELULAR,CORREO,RUC,FECHA_HORA_REGISTRO) VALUES";
function registrarReclutamiento(jsonArray, ruc) {
	var deferred = Q.defer();
	try{
		var conn = ibmdb.openSync(connString, options);
		for (var i = 0 ; i <= jsonArray.length - 1; i++) {
			var recluta = jsonArray[i];
			conn.querySync(qRegistrarReclutamiento + "('" + recluta.id + "','" + recluta.colaborador + "','" + recluta.puesto + "','" + recluta.nombres + "','" + recluta.apellidoPaterno + "','" + recluta.apellidoMaterno + "','" + recluta.celular + "','" + recluta.correo + "','" + ruc + "',CURRENT TIMESTAMP)");
		}
		conn.closeSync();
		deferred.resolve("finalizado");
	} catch(err) {
		deferred.reject(err);
	}
	
	return deferred.promise;
}

var qActualizarResultadoCorreo = "UPDATE " + schema + ".TBL_REGISTRO_RECLUTAMIENTO SET ESTADO_CORREO=";
function actualizarResultadoCorreo(id, estado) {
	var conn = ibmdb.openSync(connString, options);
	conn.querySync(qActualizarResultadoCorreo + "'" + estado + "' WHERE ID='" + id + "'");
	conn.closeSync();
}

var qActualizarResultadoSms = "UPDATE " + schema + ".TBL_REGISTRO_RECLUTAMIENTO SET ESTADO_SMS=";
function actualizarResultadoSms(id, estado) {
	var conn = ibmdb.openSync(connString, options);
	conn.querySync(qActualizarResultadoSms + "'" + estado + "' WHERE ID='" + id + "'");
	conn.closeSync();
}

var qActualizarResultadoLlamada = "UPDATE " + schema + ".TBL_REGISTRO_RECLUTAMIENTO SET ESTADO_LLAMADA=";
function actualizarResultadoLlamada(id, estado) {
	var conn = ibmdb.openSync(connString, options);
	conn.querySync(qActualizarResultadoLlamada + "'" + estado + "' WHERE ID='" + id + "'");
	conn.closeSync();
}

var qObtenerRegistroActividad = "SELECT * FROM " + schema + ".TBL_REGISTRO_RECLUTAMIENTO WHERE RUC=";
function obtenerRegistroActividad(ruc) {
	console.log("obtenerRegistroActividad: " + qObtenerRegistroActividad + "'" + ruc + "'");
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerRegistroActividad + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

module.exports.registrarReclutamiento = registrarReclutamiento;
module.exports.actualizarResultadoCorreo = actualizarResultadoCorreo;
module.exports.actualizarResultadoSms = actualizarResultadoSms;
module.exports.actualizarResultadoLlamada = actualizarResultadoLlamada;
module.exports.obtenerRegistroActividad = obtenerRegistroActividad;