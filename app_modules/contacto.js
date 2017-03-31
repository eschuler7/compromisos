'use strict';
var ibmdb = require("ibm_db");
var dbConn = require("./db2.js");

var connString = dbConn.initDBconnection();

var options = { connectTimeout : 20 }; // time out de 20 segundos para todas las conexiones sincronas

var qObtenerContactos = "SELECT DNI,NOMBRES,APELLIDOS,CORREO,TELEFONO FROM PARM.TBL_CONTACTO WHERE RUC=";
function obtenerContactos(ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qObtenerContactos + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

var qBuscarContacto = "SELECT * FROM PARM.TBL_CONTACTO WHERE DNI=";
function buscarContacto(dni) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qBuscarContacto + "'" + dni + "'");
	conn.closeSync();
	return resultado;
}

var qActualizarContacto = "UPDATE PARM.TBL_CONTACTO SET ";
function actualizarContacto(ruc, dni, nombres, apellidos, correo, telefono) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qRegistrarContacto + "NOMBRES='" + nombres + "',APELLIDOS='" + apellidos + "',CORREO='" + correo + "',TELEFONO='" + telefono + "',FECHA_HORA_ACTUALIZACION=CURRENT TIMESTAMP WHERE DNI='" + dni + "' AND RUC='" + ruc + "'");
	conn.closeSync();
}

var qRegistrarContacto = "INSERT INTO PARM.TBL_CONTACTO VALUES";
function registrarContacto(ruc, dni, nombres, apellidos, correo, telefono) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qRegistrarContacto + "('" + dni + "','" + nombres + "','" + apellidos + "','" + correo + "','" + telefono + "','" + ruc + "',CURRENT TIMESTAMP,CURRENT TIMESTAMP)");
	conn.closeSync();
}

var qEliminarContacto = "DELETE FROM PARM.TBL_CONTACTO WHERE DNI=";
function eliminarContacto(dni,ruc){
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qEliminarContacto + "'" + dni + "' AND RUC='" + ruc + "'");
	conn.closeSync();
}

module.exports.obtenerContactos = obtenerContactos;
module.exports.actualizarContacto = actualizarContacto;
module.exports.registrarContacto = registrarContacto;
module.exports.eliminarContacto = eliminarContacto;
module.exports.buscarContacto = buscarContacto;