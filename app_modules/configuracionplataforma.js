'use strict';
var ibmdb = require("ibm_db");
var dbConn = require("./db2.js");

var connString = dbConn.initDBconnection();
var schema = dbConn.getSchema();

var options = { connectTimeout : 20 }; // time out de 20 segundos para todas las conexiones sincronas

var qObtenerConfiguracionPlataforma = "SELECT TEXTO_SMS,TEXTO_LLAMADA,TEXTO_CORREO FROM " + schema + ".TBL_CONFIGURACION_PLATAFORMA WHERE RUC=";
function obtenerConfiguracionPlataforma(ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerConfiguracionPlataforma + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

var qConfiguracionInicial = "INSERT INTO " + schema + ".TBL_CONFIGURACION_PLATAFORMA SELECT ";
function configuracionInicial(ruc, paquete){
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qConfiguracionInicial + "'" + ruc + "','Somos $RAZON_SOCIAL, recibimos su CV para el puesto $PUESTO y lo invitamos a una entrevista laboral. Se envió mayor detalle a su correo.','<h3>Saludos estimado <strong>$NOMBRES $APELLIDO_PATERNO $APELLIDO_MATERNO</strong>,</h3><p>Le informamos que recibimos su CV para el puesto de <strong>$PUESTO</strong>. Por eso lo invitamos a una entrevista laboral que se realizar&aacute; el d&iacute;a <strong>$FECHA</strong> a las <strong>$HORA</strong> en la direcci&oacute;n <strong>$DIRECCION</strong>. Favor de traer CV impreso y copia de DNI.</p><p>Para cualquier consulta comunicarse a los datos que figuran en la parte inferior de este mail.</p><p>Saludos cordiales.</p><hr /><p>$RAZON_SOCIAL<br />Area de Recursos Humanos<br />$DIRECCION<br />$TELEFONO</p>','Somos $RAZON_SOCIAL, el motivo de nuestra llamada es para invitarlo a una entrevista laboral para el puesto $PUESTO que se realizará el día $FECHA, toda la información de la entrevista se lo enviamos al correo que figura en su Curriculum Vitae, cualquier consulta comunicarse a los datos que aparecen en el mail. Saludos.',TP.LLAMADAS,TP.SMS FROM " + schema + ".TBL_PAQUETE TP WHERE TP.ID='" + paquete + "'");
	conn.closeSync();
}

var qActualizartextoSms = "UPDATE " + schema + ".TBL_CONFIGURACION_PLATAFORMA SET TEXTO_SMS=";
function actualizarTextoSms(texto,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizartextoSms + "'" + texto + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qActualizartextoLlamada = "UPDATE " + schema + ".TBL_CONFIGURACION_PLATAFORMA SET TEXTO_LLAMADA=";
function actualizarTextoLlamada(texto,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizartextoLlamada + "'" + texto + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qActualizartextoEmail = "UPDATE " + schema + ".TBL_CONFIGURACION_PLATAFORMA SET TEXTO_CORREO=";
function actualizarTextoEmail(texto,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizartextoEmail + "'" + texto + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qObtenerConsumo = "SELECT TP.NOMBRE,TCP.CANT_LLAMADAS,TCP.CANT_SMS,TP.LLAMADAS,TP.SMS,(TCP.CANT_LLAMADAS*100)/TP.LLAMADAS AS P_DISPONIBLE_LLAMADA,(TCP.CANT_SMS*100)/TP.SMS AS P_DISPONIBLE_SMS FROM (" + schema + ".TBL_CONFIGURACION_PLATAFORMA TCP LEFT JOIN " + schema + ".TBL_CLIENTE TC ON TCP.RUC=TC.RUC) LEFT JOIN " + schema + ".TBL_PAQUETE TP ON TC.PAQUETE=TP.ID WHERE TC.RUC=";
function obtenerConsumoPorRUC(ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerConsumo + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

var qActualizarConsumoLlamadas = "UPDATE " + schema + ".TBL_CONFIGURACION_PLATAFORMA SET CANT_LLAMADAS=(SELECT CANT_LLAMADAS-";
function actualizarConsumoLlamadas(ruc, cant_llamadas) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizarConsumoLlamadas + cant_llamadas + " FROM " + schema + ".TBL_CONFIGURACION_PLATAFORMA WHERE RUC='" + ruc + "') WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qActualizarConsumoSms = "UPDATE " + schema + ".TBL_CONFIGURACION_PLATAFORMA SET CANT_SMS=(SELECT CANT_SMS-";
function actualizarConsumoSms(ruc, cant_sms) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizarConsumoSms + cant_sms + " FROM " + schema + ".TBL_CONFIGURACION_PLATAFORMA WHERE RUC='" + ruc + "') WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

module.exports.obtenerConfiguracionPlataforma = obtenerConfiguracionPlataforma;
module.exports.actualizarTextoSms = actualizarTextoSms;
module.exports.actualizarTextoLlamada = actualizarTextoLlamada;
module.exports.actualizarTextoEmail = actualizarTextoEmail;
module.exports.configuracionInicial = configuracionInicial;
module.exports.obtenerConsumoPorRUC = obtenerConsumoPorRUC;
module.exports.actualizarConsumoLlamadas = actualizarConsumoLlamadas;
module.exports.actualizarConsumoSms = actualizarConsumoSms;