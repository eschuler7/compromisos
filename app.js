'use strict';
var express = require("express");
var session = require('express-session');
var bodyParser = require("body-parser");
var clientedb = require("./app_modules/cliente.js");
var usuariodb = require("./app_modules/usuario.js");
var reclutamientodb = require("./app_modules/registroreclutamiento.js");
var configuracionplataformadb = require("./app_modules/configuracionplataforma.js");
var contactodb = require("./app_modules/contacto.js");
var twilio = require("./app_modules/twilio.js");
var nodemailer = require('nodemailer');
var multer  = require('multer');
var Excel = require('exceljs');
var http = require('http');
var fs = require("fs");
var dateFormat = require('dateformat');

var app = express();

//ALL ENVIRONMENT VARIABLES
app.set("port", process.env.PORT || 80);
app.set("view engine", "pug");

//APPLICATION CONFIGURATIONS
app.use(express.static(__dirname + "/public"));
app.use(session({
  secret: '1qwe34rsc87yh',
  resave: false,
  saveUninitialized: true
}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var storageReclutas = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/reclutamiento/')
  },
  filename: function (req, file, cb) {
  	var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});
var uploadreclutas = multer({ storage: storageReclutas });
var url_base = "http://www.parmperu.com"

var storageImagenPerfil = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imagenesperfil/')
  },
  filename: function (req, file, cb) {
  	var ruc = req.session.usuario.RUC;
    cb(null, ruc + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});
var uploadImagenPerfil = multer({ storage: storageImagenPerfil });



// -- FILTROS --
// Filtro de sesion
app.all("/parmsecure/*",function(req,res,next){
	if(req.session.usuario){
		next();
	} else {
		res.redirect('/');
	}
});

// Filtro de administración
app.all("/parmsecure/admin/*",function(req,res,next){
	if(req.session.usuario.ROL == 2){
		next();
	} else {
		res.redirect('/parmsecure/index');
	}
});

// -- RUTEOS DE USUARIOS NORMALES --
app.get("/",function(req,res){
	res.render("login");
});

app.get("/nuevoregistro",function(req, res){
	res.render("registro");
});

app.get("/olvidocontrasena",function(req, res){
	res.render("olvidocontrasena");
});

app.get("/activarcuenta", function(req,res){
	var ruc = req.query.ruc;
	var codigo = req.query.cod;
	try {
		usuariodb.activarCuenta(ruc,codigo);
		res.render("activacioncuentaok");
	} catch (err) {
		console.log(err);
		res.render("activacioncuentaerror");
	}
});

app.get("/parmsecure/index", function(req,res){
	res.render("index");
});

app.get("/parmsecure/reclutamiento", function(req,res){
	res.render("reclutamiento");
});

app.get("/parmsecure/actividad", function(req, res){
	res.render("actividad");
});

app.get("/parmsecure/estadisticas", function(req, res){
	var consumo;
	try{
		consumo = configuracionplataformadb.obtenerConsumoPorRUC(req.session.usuario.RUC);
		console.log(consumo);
	} catch (err) {
		console.log(err);
	}
	res.render("estadisticas",{consumo:consumo[0]});
});

app.get("/parmsecure/perfil", function(req, res){
	var configuracion_plataforma;
	var clientes;
	var contactos;
	try {
		clientes = clientedb.buscarClienteXRuc(req.session.usuario.RUC);
		contactos = contactodb.obtenerContactos(req.session.usuario.RUC);
		configuracion_plataforma = configuracionplataformadb.obtenerConfiguracionPlataforma(req.session.usuario.RUC);
	} catch(err) {
		console.log(err);
	}
	res.render("perfil",{cliente:clientes[0],contactos:contactos,configuracion_plataforma:configuracion_plataforma[0]});
});

app.get("/parmsecure/imagen/:ruc", function(req, res){
	clientedb.obtenerImagenperfil(req.session.usuario.RUC)
	.then(function(imagenperfil){
		if(imagenperfil == null) {
			res.sendFile(__dirname + "/uploads/imagenesperfil/" + "default-user-160x160.jpg");
		} else {
			res.sendFile(__dirname + "/" + imagenperfil);
		}
	})
	.fail(function(err){
		console.log(err);
	});
	
});

app.get("/parmsecure/cerrarsesion",function(req,res){
	if(req.session.usuario) {
		req.session.destroy();
		res.render("login",{info:"Gracias por usar PARM, vuelve pronto!"});
	} else {
		res.render("login");
	}
});

app.get("/parmsecure/reclutar",function(req, res){
	var file = req.session.ultimacarga;
	var jsonArray = [];
	if(file){
		var workbook = new Excel.Workbook();
		workbook.xlsx.readFile('./uploads/reclutamiento/' + file).then(function() {
	    	var worksheet = workbook.getWorksheet(1);
	    	worksheet.eachRow(function(row, rowNumber){
	    		if(rowNumber != 1) {
					var correotmp;
		    		if(typeof row.values[8] === 'object'){
		    			correotmp = row.values[8].text;
		    		} else {
		    			correotmp = row.values[8];
		    		}

	    			var json = {
	    				id:Date.now()+ "" + row.values[7],
	    				nro:row.values[1],
	    				colaborador:row.values[2],
	    				puesto:row.values[3],
	    				nombres:row.values[4],
	    				apellidoPaterno:row.values[5],
	    				apellidoMaterno:row.values[6],
	    				celular:row.values[7],
	    				correo:correotmp,
	    				fecha:row.values[9],
	    				hora:row.values[10]
	    			}

	    			jsonArray.push(json);
	    		}
	    	});

	    	var ruc = req.session.usuario.RUC;
	    	var razon_social = req.session.usuario.RAZON_SOCIAL;
	    	var config = configuracionplataformadb.obtenerConfiguracionPlataforma(ruc);

	    	reclutamientodb.registrarReclutamiento(jsonArray,req.session.usuario.RUC)
	    	var texto = config[0].TEXTO_SMS;
	    	.then(function(){
	    		console.log("Inicia el envío de mensajes de texto");
	    		for (var i = jsonArray.length - 1; i >= 0; i--) {
	    			var recluta = jsonArray[i];
	    			enviarSms(recluta.celular,recluta.id,texto);
	    		}
	    	})
	    	.then(function(){
	    		console.log("Inicia las llamadas a celular");
	    		for (var i = jsonArray.length - 1; i >= 0; i--) {
	    			var recluta = jsonArray[i];
	    			var fecha = formatearFecha(recluta.fecha);
	    			var hora = formatearHora(recluta.hora);
	    			generarLlamada(recluta.celular,recluta.id,ruc,razon_social,recluta.puesto,fecha,hora);
	    		}
	    	})
	    	.then(function(){
	    		console.log("Inicia el envío de correo electrónico");
	    		for (var i = jsonArray.length - 1; i >= 0; i--) {
	    			var recluta = jsonArray[i];
	    			var htmlbody = "<html>" +
	    			"<h2>Reclutamiento de personal</h2>" + 
		    		"<p>Estimado " + recluta.nombres + " " + recluta.apellidoPaterno + " " + recluta.apellidoMaterno + ",</p>" +
		    		"<p>La empresa " + req.session.usuario.RAZON_SOCIAL + " lo invita a una convocatoria para el puesto de " + recluta.puesto + ".</p>" +
		    		"<p></p>" + 
		    		"</html>";
		    		enviarCorreo(recluta.correo,"Convocatoria de personal",htmlbody,true,recluta.id);
	    		}
	    	})
	    	.fail(function(err){
	    		console.log(err);
	    	})
	    	.done();

	    	res.send("ok");
	    });

		configuracionplataformadb.actualizarConsumoSms(req.session.usuario.RUC,jsonArray.length);
	    //falta la actualizacion de las llamadas
	} else {
		console.log("No se ha cargado ningún archivo.");
	}
	
});

app.get("/resetearcontrasena",function(req, res){
	var ruc = req.query.ruc;
	var codigoReseteo = req.query.cod;
	var contrasenaTemmporal = codigoAleatorio("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",8);

	try{
		usuariodb.resetearContrasena(ruc,contrasenaTemmporal,codigoReseteo);

		var resultado = clientedb.buscarClienteXRuc(ruc);

		var htmlbody = "<3>Estimado Cliente,</h3>" + 
		"<p>Hemos reseteado la contraseña de su cuenta a una temporal.</p>" +
		"<p>La contraseña temporal es: <strong>" + contrasenaTemmporal + "</strong></p>" +
		"<p>Si usted no la solicitó por favor omitir este mensaje.</p>";

		enviarCorreo(resultado[0].CORREO, "Solicitud de reseteo de contraseña", htmlbody,false,null);

		res.render("reseteocontrasenamsg",{
			ok:"¡El reseteo de contraseña fue exitoso!",
			info:"Le hemos enviado una contraseña temporal a su correo, recuerde cambiar su contraseña en su perfil parm."
		});

	} catch(err) {
		console.log(err);
		res.render("reseteocontrasenamsg",{
			error:"¡Ups! Ocurrió un error durante el proceso de reseteo de su contraseña",
			info:"Por favor vuelve a intentarlo nuevamente."
		});
	}
});

// -- RUTEOS DE ADMINISTRADOR --
app.get("/parmsecure/admin/solicitudes", function(req,res){
	res.render("solicitudes");
});

// -- POSTS --
// Estados:
//	1: Registrado pero no activado
//	2: Código de confirmación enviado
//	3: Registrado y activado
// Roles:
//	1: Usuario común
//	2: Administrador
app.post("/registro",function(req, res){
	var cliente = {
		ruc:req.body.ruc,
		razonsocial:req.body.razonsocial,
		direccion:req.body.direccion,
		email:req.body.email,
		telefono:req.body.telefono
	}
	var contacto1 = {
		dni:req.body.contacto1dni,
		nombres:req.body.contacto1nombres,
		apellidos:req.body.contacto1apellidos,
		correo:req.body.contacto1correo,
		telefono:req.body.contacto1telefono
	}
	var usuario = {
		ruc:req.body.ruc,
		contrasena:req.body.contrasena,
		rol:1,
		estado:1
	}

	try{
		clientedb.registrarCliente(cliente);
		contactodb.registrarContacto(cliente.ruc, contacto1.dni, contacto1.nombres, contacto1.apellidos, contacto1.correo, contacto1.telefono);
		usuariodb.registrarUsuario(usuario);

		var htmlAdmin = "<h3>Registro de nuevo cliente</h3><p>Se recibió una nueva solicitud de registro del cliente <b>" + cliente.razonsocial + "</b> identificado con ruc <b>" + cliente.ruc + "</b>.</p>" +
		"<p>Por favor ingresar a la sección de solicitudes de PARM para aprobar o rechazar la solicitud.</p>"+
		"<hr></hr>"+
		"<p>Area de sistemas de PARM</p>";
		enviarCorreo("parmperu@gmail.com","Confirmación de registro de nuevo cliente.",htmlAdmin,false,null);

		var htmlCliente = "<!DOCTYPE html>"+
		"<html>" +
		"<head>" +
		"<meta charset='utf-8'>" +
		"</head>" +
		"<body style='font-family: Calibri'>" +
		"<h3>Hola " + cliente.razonsocial + ",</h3>" +
		"<p>Estás recibiendo este correo porque recientemente te has registrado en la plataforma PARM con esta dirección de correo electrónico.<br>" +
		"Estamos validando tu registro, espera nuestro correo de confirmación para que procedas con la activación de la cuenta.</p>" +
		"<p>¡Gracias por confiar en la plataforma PARM!</p>" +
		"</body>" +
		"</html>";
		enviarCorreo(cliente.email,"Registro de cuenta PARM", htmlCliente,false,null);

		res.render("registrook",{email:cliente.email});
	}catch(err){
		console.log(err);
		res.render("registroerror");
	}
});

app.post("/iniciarsesion",function(req,res){
	var ruc = req.body.ruc;
	var contrasena = req.body.contrasena;
	try {
		var queryuser = usuariodb.autentificacionUsuario(ruc, contrasena);

		if(queryuser.length == 1) {
			var queryusuario = queryuser[0];
			if(queryusuario.ESTADO == '3'){
				req.session.usuario = queryuser[0];
				res.redirect("/parmsecure/index");
			} else {
				res.render("login",{alert:"La cuenta aún no ha sido activada."});
			}
			
		} else {
			res.render("login",{error:"Los datos ingresados no son correctos."});
		}
	} catch (err) {
		console.log(err);
		res.render("login",{error:"Lo sentimos hubo un error con el inicio de sesión, por favor volver a intentar en unos minutos."});
	}
	
});

app.post("/solicitarreseteo", function (req, res) {
	var ruc = req.body.ruc;

	try{
		var codigoReseteo = codigoAleatorio("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",16);

		var cliente = clientedb.buscarClienteXRuc(ruc);
		usuariodb.solicitarReseteoContrasena(ruc, codigoReseteo);

		var htmlbody = "<h3>Estimado Cliente,</h3>" + 
		"<p>Hemos recibido una solicitud de reseteo de contraseña, si usted la solicitó, por favor haga click en el siguiente enlace:</p>" +
		"<p><a href='" + url_base + "/resetearcontrasena?ruc=" + ruc + "&cod=" + codigoReseteo + "'>Resetear contraseña</a></p>" +
		"<p>Si usted no la solicitó por favor omitir este correo.</p>";

		enviarCorreo(cliente[0].CORREO, "Solicitud de reseteo de contraseña", htmlbody,false,null);

		res.render("reseteocontrasenamsg",{
			ok:"¡La solicitud de reseteo de contraseña fue exitoso!",
			info:"Le hemos enviado un enlace a su dirección de correo electrónico para proceder con el siguiente paso de reseteo de contraseña."
		});

	} catch(err) {
		console.log(err);
		res.render("reseteocontrasenamsg",{
			error:"¡Ups! Ocurrió un error durante el proceso de reseteo de su contraseña",
			info:"Por favor vuelve a intentarlo nuevamente."
		});
	}
});

app.post('/parmsecure/upload', uploadreclutas.single('reclutas'), function (req, res) {
	var workbook = new Excel.Workbook();
	var jsonArray = [];
	req.session.ultimacarga = req.file.filename;
	workbook.xlsx.readFile('./uploads/reclutamiento/' + req.file.filename).then(function() {
    	var worksheet = workbook.getWorksheet(1);
    	worksheet.eachRow(function(row, rowNumber){
    		if(rowNumber != 1) {
    			var correotmp;
	    		if(typeof row.values[8] === 'object'){
	    			correotmp = row.values[8].text;
	    		} else {
	    			correotmp = row.values[8];
	    		}

    			var json = {
    				nro:row.values[1],
    				colaborador:row.values[2],
    				puesto:row.values[3],
    				nombres:row.values[4],
    				apellidoPaterno:row.values[5],
    				apellidoMaterno:row.values[6],
    				celular:row.values[7],
    				correo:correotmp,
    				fecha:row.values[9],
    				hora:row.values[10]
    			}
    			jsonArray.push(json);
    		}
    	});
    	res.render("reclutamiento",{reclutascargados:JSON.stringify(jsonArray)});
    });
});

app.post("/parmsecure/actualizarimagenperfil",uploadImagenPerfil.single('imagenperfil'), function(req, res){
	res.redirect("/parmsecure/perfil");
});

app.post("/parmsecure/actualizarinformacion", function(req, res){
	var direccion = req.body.direccion;
	var correo = req.body.correo;
	var telefono = req.body.telefono;
	var ruc = req.session.usuario.RUC;
	try{
		clientedb.actualizarInformacion(direccion,correo,telefono,ruc);
	} catch (err) {
		console.log(err);
	}
	res.redirect("/parmsecure/perfil");
});

app.post("/parmsecure/actualizarcontacto", function(req, res){
	var dni = req.body.dni_contacto;
	var nombres = req.body.nombres_contacto;
	var apellidos = req.body.apellidos_contacto;
	var correo = req.body.correo_contacto;
	var telefono = req.body.telefono_contacto;
	var ruc = req.session.usuario.RUC;

	var contacto = contactodb.buscarContacto(dni);

	try{
		if(contacto[0]) {
			contactodb.actualizarContacto(ruc, dni, nombres, apellidos, correo, telefono);
		} else {
			contactodb.registrarContacto(ruc, dni, nombres, apellidos, correo, telefono);
		}
	} catch (err){
		console.log(err);
	}

	res.redirect("/parmsecure/perfil");
});

app.post("/parmsecure/eliminarcontacto", function(req, res){
	var dni = req.body.dni;
	var ruc = req.session.usuario.RUC;

	try{
		contactodb.eliminarContacto(dni,ruc);
	} catch (err){
		console.log(err);
	}
	res.redirect("/parmsecure/perfil");
});

// -- AJAX GET CALLS --
app.get("/parmsecure/admin/listarsolicitudespendientes",function(req,res){
	var solicitudes = null;
	try{
		solicitudes = clientedb.solicitudesPendientes();
	} catch(err) {
		console.log(err);
	}
	res.setHeader("content-type","text/json");
	res.send(solicitudes);
});

app.get("/parmsecure/actualizarubicacion",function(req,res){
	var ruc = req.session.usuario.RUC;
	var latitud = req.query.lat;
	var longitud = req.query.lng;
	try{
		clientedb.actualizarUbicacion(latitud,longitud,ruc);
		res.send("La ubicación fue actualizada.");
	} catch (err) {
		console.log(err);
		res.send(err);
	}
});

app.get("/parmsecure/registroactividad",function(req, res){
	var registroactividad = reclutamientodb.obtenerRegistroActividad(req.session.usuario.RUC);
	res.setHeader("content-type","text/json");
	res.send(registroactividad);
});

app.get("/parmsecure/admin/confirmarsolicitud",function(req, res){
	var seleccion = req.query.seleccion;
	var htmlbody = "<h3>Código de confirmación</h3>"+
	"<p>Estimado cliente, el presente correo contiene el enlace para la confirmación de su cuenta. Hacer click en el siguiente enlace para activar su cuenta.</p>";
	for (var i = seleccion.length - 1; i >= 0; i--) {
		var codigo = codigoAleatorio("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",16);
		try{
			usuariodb.actualizarCodigoConfirmacion(seleccion[i].ruc,codigo);
			clientedb.actualizarPaquete(seleccion[i].ruc,seleccion[i].paquete);
			configuracionplataformadb.configuracionInicial(seleccion[i].ruc,seleccion[i].paquete);
			htmlbody += "<p><a href='" + url_base + "/activarcuenta?ruc=" + seleccion[i].ruc + "&cod=" + codigo + "'>Activar tu cuenta</a></p>"
			enviarCorreo(seleccion[i].correo,"Código de confirmación PARM", htmlbody,false,null);
			//console.log(htmlbody);
		} catch (err) {
			console.log("Hubo un error al actualizar los datos de confirmación, por favor revisar los logs.");
			console.log(err);
		}
	}
	res.send("ok");
});

app.post("/twiml",function(req, res){
	try{
		var ruc = req.query.r;
		var razon_social = req.query.rs;
		var puesto = req.query.p;
		var fecha = req.query.f;
		var hora = req.query.h;

		var config = configuracionplataformadb.obtenerConfiguracionPlataforma(ruc);
		var texto = config[0].TEXTO_LLAMADA;
		if(razon_social) {
			texto = texto.replace("$RAZON_SOCIAL",razon_social);
		}
		if(puesto){
			texto = texto.replace("$PUESTO",puesto);
		}
		if(fecha) {
			texto = texto.replace("$FECHA",fecha);
		}
		if(hora) {
			texto = texto.replace("$HORA", hora);
		}

		var twiml = '<?xml version="1.0" encoding="UTF-8"?>';
		twiml += '<Response>';
		twiml += '<Say voice="alice" language="es-MX">';
		twiml += texto;
		twiml += '</Say>';
		twiml += '</Response>';

		console.log(twiml);

		res.setHeader("content-type","text/xml");
		res.send(twiml);
	} catch (err) {
		console.log(err);
		res.status(505).send("Ocurrió un error en el servidor");
	}
});

// -- AJAX POST CALLS --

app.post("/parmsecure/guardartextosms", function(req, res){
	var textosms = req.body.textosms;
	var ruc = req.session.usuario.RUC;
	res.setHeader("content-type","text/plain");
	try {
		configuracionplataformadb.actualizarTextoSms(textosms,ruc);
		res.send("El texto de los SMS fue actualizado.");
	} catch (err) {
		console.log(err);
		res.send(err);
	}
});

app.post("/parmsecure/guardartextollamada", function(req, res){
	var textollamada = req.body.textollamada;
	var ruc = req.session.usuario.RUC;
	res.setHeader("content-type","text/plain");
	try {
		configuracionplataformadb.actualizarTextoLlamada(textosms,ruc);
		res.send("El texto de las llamadas fue actualizado.");
	} catch (err) {
		console.log(err);
		res.send(err);
	}
});

app.post("/parmsecure/guardartextocorreo", function(req, res){
	var textocorreo = req.body.textocorreo;
	var ruc = req.session.usuario.RUC;
	res.setHeader("content-type","text/plain");
	try {
		configuracionplataformadb.actualizarTextoEmail(textosms,ruc);
		res.send("El texto del correo fue actualizado.");
	} catch (err) {
		console.log(err);
		res.send(err);
	}
});

// -- ADICIONAL FUNCTIONS --
function enviarCorreo(email, asunto, htmlbody, actualizarbd, id){
	var smtpConfig = {
	    host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL 
	    auth: {
	        user: 'parmperu@gmail.com',
	        pass: 'parmperu241803'
	    }
	};
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport(smtpConfig);
	 
	// setup e-mail data with unicode symbols 
	var mailOptions = {
	    from: '"PARM PERU" <parmperu@gmail.com>', // sender address 
	    to: email, // list of receivers 
	    subject: asunto, // Subject line 
	    html: htmlbody // html body 
	};
	 
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        if(actualizarbd){
	        	reclutamientodb.actualizarResultadoCorreo(id, error);
	        }
	    } else {
	    	console.log(info);
	    	if(actualizarbd){
	    		reclutamientodb.actualizarResultadoCorreo(id, info.response);
	    	}
	    }
	    transporter.close();
	});
}

var client = twilio.initTwilioClient();
function generarLlamada(numeroCelular,id,ruc,razon_social,puesto,fecha,hora) {
	var url = url_base + "/twiml?r=" + ruc + "&rs=" + razon_social + "&p=" + puesto + "&f=" + fecha + "&h=" + hora;
	client.calls.create({
		to:'+51' + numeroCelular,
		from: "+51946198461",
		url: encodeURI(url)
	}, function(err, call) {
		if(err) {
			console.log(err);
			reclutamientodb.actualizarResultadoLlamada(id,err.status);
		} else {
			console.log(call);
			reclutamientodb.actualizarResultadoLlamada(id,call.sid);
		}
	});
}

function enviarSms(numeroCelular,id,texto){
	var uri = '/enviar_sms.asp?api=1&relogin=1&usuario=SMSAPI&clave=SMSAPI964&tos='+ numeroCelular + '&idinterno=&texto=' + texto;
	var options = {
		host: 'servicio.smsmasivos.com.ar',
		path: encodeURI(uri)
	};
	var httpreq = http.request(options,function(httpres){
		var str = '';
		httpres.on('data', function (chunk) {
	    	str += chunk;
	 	});
	 	httpres.on('end', function () {
	 		console.log(str);
	 		reclutamientodb.actualizarResultadoSms(id,str);
	 	});
	});
	httpreq.end();
}

function codigoAleatorio(chars, lon){
	var codigo = "";
	for (var x=0; x < lon; x++)	{
		var ale = Math.floor(Math.random()*chars.length);
		codigo += chars.substr(ale, 1);
	}
	return codigo;
}

function formatearFecha(fecha) {
	var fechastr = dateFormat(fecha, "dddd d 'de' mmmm 'del' yyyy");
	var fectmp = fechastr.split(' ');
	switch (fectmp[0]) {
	    case 'Monday':
	        fechastr = fechastr.replace("Monday","Lunes");
	        break;
	    case 'Tuesday':
	        fechastr = fechastr.replace("Tuesday","Martes");
	        break;
	    case 'Wednesday':
	        fechastr = fechastr.replace("Wednesday","Miercoles");
	        break;
	    case 'Thursday':
	        fechastr = fechastr.replace("Thursday","Jueves");
	        break;
	    case 'Friday':
	        fechastr = fechastr.replace("Friday","Viernes");
	        break;
	    case 'Saturday':
	        fechastr = fechastr.replace("Saturday","Sabado");
	        break;
	    case 'Sunday':
	        fechastr = fechastr.replace("Sunday","Domingo");
	}

	switch (fectmp[3]) {
	    case 'January':
	        fechastr = fechastr.replace("January","Enero");
	        break;
	    case 'February':
	        fechastr = fechastr.replace("February","Febrero");
	        break;
	    case 'March':
	        fechastr = fechastr.replace("March","Marzo");
	        break;
	    case 'April':
	        fechastr = fechastr.replace("April","Abril");
	        break;
	    case 'May':
	        fechastr = fechastr.replace("May","Mayo");
	        break;
	    case 'June':
	        fechastr = fechastr.replace("June","Junio");
	        break;
	    case 'July':
	        fechastr = fechastr.replace("July","Julio");
	        break;
	    case 'August':
	        fechastr = fechastr.replace("August","Agosto");
	        break;
	    case 'September':
	        fechastr = fechastr.replace("September","Setiembre");
	        break;
	    case 'October':
	        fechastr = fechastr.replace("October","Octubre");
	        break;
	    case 'November':
	        fechastr = fechastr.replace("November","Noviembre");
	        break;
	    case 'December':
	        fechastr = fechastr.replace("December","Diciembre");
	}

	return fechastr;
}

function formatearHora(hora) {
	var hora = dateFormat(hora, "H");
	var minutos = dateFormat(hora, "M");
	var horastr = dateFormat(hora, "h");

	if(minutos > 0) {
		horastr += " y " + minutos;
	}

	if(hora < 12) {
		horastr += " de la mañana";
	} else if (hora >= 12 && hora < 7) {
		horastr += " de la tarde";
	} else {
		horastr += " de la noche";
	}
	return horastr;
}

/*function limpiarImagenPerfil(ruc) {
	// Find files
	glob("./uploads/imagenesperfil/" + ruc + ".*",function(err,files){
	     if (err) throw err;
	     files.forEach(function(item,index,array){
	          console.log(item + " encontrado");
	     });
	     // Delete files
	     files.forEach(function(item,index,array){
	          fs.unlink(item, function(err){
	               if (err) throw err;
	               console.log(item + " eliminado");
	          });
	     });
	});
}*/

app.listen(app.get("port"), "0.0.0.0", function() {
	console.log("PARM Nodejs Server iniciado en el puerto " + app.get("port"));
	//var texto = "Somos $RAZON_SOCIAL, recibimos su CV para el puesto $PUESTO y lo invitamos a una entrevista laboral. Se envió mayor detalle a su correo.";
	//texto = texto.replace("$RAZON_SOCIAL","DELPA GROUP");
	//texto = texto.replace(/ /g,"%20");
	//console.log(texto);
});