'use strict';
var ibmdb = require("ibm_db");
var dbConn = require("./db2.js");
var glob = require("glob");
var Q = require("q");

var connString = dbConn.initDBconnection();

var options = { connectTimeout : 20 }; // time out de 20 segundos para todas las conexiones sincronas

var qListarClientes = "SELECT * FROM PARM.TBL_CLIENTE";
function listarClientes(){
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qListarClientes);
	conn.closeSync();
	return resultado;
}

var qActualizarUbicacion = "UPDATE PARM.TBL_CLIENTE SET LATITUD=";
function actualizarUbicacion(lat,lng,ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizarUbicacion + lat + ",LONGITUD=" + lng + " WHERE RUC='" + ruc +"'");
	conn.closeSync();
}

var qActualizarInformacion = "UPDATE PARM.TBL_CLIENTE SET DIRECCION=";
function actualizarInformacion(direccion, correo, telefono, ruc) {
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qActualizarInformacion + "'" + direccion + "',CORREO='" + correo + "',TELEFONO='" + telefono + "' WHERE RUC='" + ruc + "'");
	conn.closeSync();
}

var qRegistrarCliente = "INSERT INTO PARM.TBL_CLIENTE(RUC,RAZON_SOCIAL,DIRECCION,TELEFONO,CORREO,FECHA_HORA_REGISTRO,FECHA_HORA_ACTUALIZACION) VALUES";
function registrarCliente(cliente){
	var conn = ibmdb.openSync(connString, options);
	var result = conn.querySync(qRegistrarCliente+"('" + cliente.ruc + "','" + cliente.razonsocial + "','" + cliente.direccion + "','" + cliente.telefono + "','" + cliente.email + "',CURRENT TIMESTAMP,CURRENT TIMESTAMP)");
	conn.closeSync();
}

var qSolicitudesPendientes = "SELECT TC.RUC,TC.RAZON_SOCIAL,TC.CORREO,TC.TELEFONO,TU.ESTADO FROM PARM.TBL_USUARIO TU LEFT JOIN PARM.TBL_CLIENTE TC ON TU.RUC=TC.RUC WHERE ESTADO<3;"
function solicitudesPendientes(){
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qSolicitudesPendientes);
	conn.closeSync();
	return resultado;
}

var qBuscarClienteXRuc = "SELECT * FROM PARM.TBL_CLIENTE WHERE RUC=";
function buscarClienteXRuc(ruc){
	var conn = ibmdb.openSync(connString, options);
	var resultado = conn.querySync(qBuscarClienteXRuc + "'" + ruc + "'");
	conn.closeSync();
	return resultado;
}

function obtenerImagenperfil(ruc) {
	var deferred = Q.defer();
	var imagenperfil = null;
	try{
		glob("./uploads/imagenesperfil/" + ruc + ".*",function(err,files){
		    if (err) throw err;
		    files.forEach(function(item,index,array){
		        deferred.resolve(item);
		    });
		    deferred.resolve(imagenperfil);
		});
	} catch (err) {
		deferred.reject(err);
	}
	return deferred.promise;
}

module.exports.listarClientes = listarClientes;
module.exports.registrarCliente = registrarCliente;
module.exports.solicitudesPendientes = solicitudesPendientes;
module.exports.buscarClienteXRuc = buscarClienteXRuc;
module.exports.actualizarUbicacion = actualizarUbicacion;
module.exports.actualizarInformacion = actualizarInformacion;
module.exports.obtenerImagenperfil = obtenerImagenperfil;