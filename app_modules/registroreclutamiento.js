'use strict';
var ibmdb = require("ibm_db");
var dbConn = require("./db2.js");
var Q = require("q");

var connString = dbConn.initDBconnection();
var schema = dbConn.getSchema();

var options = { connectTimeout : 20 }; // time out de 20 segundos para todas las conexiones sincronas

var qRegistrarReclutamiento = "INSERT INTO " + schema + ".TBL_REGISTRO_RECLUTAMIENTO(ID,RESPONSABLE,PUESTO,NOMBRES,APELLIDO_PATERNO,APELLIDO_MATERNO,CELULAR,CORREO,RUC,IDGRUPO,FECHA_HORA_REGISTRO) VALUES";
function registrarReclutamiento(jsonArray, ruc, idgrupo) {
	var deferred = Q.defer();
	try{
		var conn = ibmdb.openSync(connString, options);
		for (var i = 0 ; i <= jsonArray.length - 1; i++) {
			var recluta = jsonArray[i];
			conn.querySync(qRegistrarReclutamiento + "('" + recluta.id + "','" + recluta.colaborador + "','" + recluta.puesto + "','" + recluta.nombres + "','" + recluta.apellidoPaterno + "','" + recluta.apellidoMaterno + "','" + recluta.celular + "','" + recluta.correo + "','" + ruc + "','" + idgrupo + "',CURRENT TIMESTAMP)");
		}
		conn.closeSync();
		deferred.resolve("finalizado");
	} catch(err) {
		deferred.reject(err);
	}
	
	return deferred.promise;
}

var qObtenerProgresoReclutamiento = "SELECT * FROM " + schema + ".TBL_REGISTRO_RECLUTAMIENTO WHERE RUC=";
function obtenerProgresoReclutamiento(ruc, idgrupo) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerProgresoReclutamiento + "'" + ruc + "' AND IDGRUPO='" + idgrupo + "'");
	conn.closeSync();
	return resultado;
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
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerRegistroActividad + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

var qReporteSemanal = "SELECT DAYNAME(FECHA_HORA_REGISTRO) NOMBREDIA,DAYOFWEEK_ISO(FECHA_HORA_REGISTRO) NUMERODIA,DATE(FECHA_HORA_REGISTRO) FECHA,COUNT(*) CONVOCATORIAS FROM " + schema + ".TBL_REGISTRO_RECLUTAMIENTO WHERE WEEK_ISO(FECHA_HORA_REGISTRO)=";
function reporteSemanal(semana) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qReporteSemanal + semana + " GROUP BY DAYNAME(FECHA_HORA_REGISTRO),DAYOFWEEK_ISO(FECHA_HORA_REGISTRO),DATE(FECHA_HORA_REGISTRO) ORDER BY DATE(FECHA_HORA_REGISTRO) ASC");
	conn.closeSync();
	return resultado;
}

var qReporteMensual = "SELECT MONTHNAME(FECHA_HORA_REGISTRO) NOMBREMES,MONTH(FECHA_HORA_REGISTRO) NUMEROMES,COUNT(*) CONVOCATORIAS FROM " + schema + ".TBL_REGISTRO_RECLUTAMIENTO WHERE YEAR(FECHA_HORA_REGISTRO)=";
function reporteAnual(ano){
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qReporteMensual + ano + " GROUP BY MONTHNAME(FECHA_HORA_REGISTRO),MONTH(FECHA_HORA_REGISTRO)");
	conn.closeSync();
	return resultado;
}

module.exports.registrarReclutamiento = registrarReclutamiento;
module.exports.actualizarResultadoCorreo = actualizarResultadoCorreo;
module.exports.actualizarResultadoSms = actualizarResultadoSms;
module.exports.actualizarResultadoLlamada = actualizarResultadoLlamada;
module.exports.obtenerRegistroActividad = obtenerRegistroActividad;
module.exports.obtenerProgresoReclutamiento = obtenerProgresoReclutamiento;
module.exports.reporteSemanal = reporteSemanal;
module.exports.reporteAnual = reporteAnual;