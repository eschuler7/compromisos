'use strict';
// Loading package cloud for bluemix
var pkgcloud = require('pkgcloud-bluemix-objectstorage');
var pkgcloudStorage = require('multer-storage-pkgcloud');
//Loading config library
var config = require('./config');

var osconfig = {
	provider:'openstack',
	authUrl: 'https://identity.open.softlayer.com/',
	useServiceCatalog: true,
	auth : {
	    forceUri : "https://identity.open.softlayer.com/v3/auth/tokens",
	    identity: {
	        methods: ["password"],
	        password: {user: {}}
	    },
	    scope: {project: {}}
	}
};
if(process.env.VCAP_SERVICES) {
	var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
	if(vcapServices['Object-Storage']){
		var objectStorage = vcapServices['Object-Storage'][0].credentials;
		osconfig.region = objectStorage.region;
		osconfig.useInternal = true;
		osconfig.tenantId = objectStorage.projectId;
		osconfig.userId = objectStorage.userId;
		osconfig.username = objectStorage.username;
		osconfig.password = objectStorage.password;
		osconfig.auth.interfaceName = 'internal';
		osconfig.auth.identity.password.user.id = objectStorage.userId;
		osconfig.auth.identity.password.user.password = objectStorage.password;
		osconfig.auth.scope.project.id = objectStorage.projectId;
	}
} else {
	osconfig.region = config().objectstorage.region;
	osconfig.useInternal = config().objectstorage.useInternal;
	osconfig.tenantId = config().objectstorage.projectId;
	osconfig.userId = config().objectstorage.userId;
	osconfig.username = config().objectstorage.username;
	osconfig.password = config().objectstorage.password;
	osconfig.auth.interfaceName = config().objectstorage.auth.interfaceName;
	osconfig.auth.identity.password.user.id = config().objectstorage.userId;
	osconfig.auth.identity.password.user.password = config().objectstorage.password;
	osconfig.auth.scope.project.id = config().objectstorage.projectId;
}

var storageClient = pkgcloud.storage.createClient(osconfig);

var objectstorage = {
	container : {
		createContainer : function(ruc) {
			storageClient.auth(function(error){
				if(error) {
					console.log('Hubo un error en la conexión con el Object Storage:', error);
				} else {
					storageClient.createContainer(ruc, function(err, container){
						if(err) {
							console.log('No se pudo crear el object storage container',ruc);
							console.log(err);
						} else {
							console.log('Object Storage Creado:', container.name);
						}
					});
				}
			});
		},
		destroyContainer : function(ruc) {
			storageClient.auth(function(error){
				if(error) {
					console.log('Hubo un error en la conexión con el Object Storage:', error);
				} else {
					storageClient.destroyContainer(ruc, function(err, result){
						if(err) {
							console.log('No se pudo eliminar el object storage container',ruc);
							console.log(err);
						} else {
							console.log('Object Storage Eliminado:', result);
						}
					});
				}
			});
		}
	},
	file : {
		getFiles : function(ruc, res) {
			storageClient.auth(function(error){
				if(error) {
					console.log('Hubo un error en la conexión con el Object Storage:', error);
				} else {
					storageClient._getFiles(ruc, {prefix:'prueba2/'},function(err, files){
						if(err) {
							console.log('No se pudo obtener los archivos',ruc);
							console.log(err);
						} else {
							console.log('File:', files);
							res.render('partial/commitment/prueba', {files:files});
						}
					});
				}
			});
		},
		downloadFile : function(ruc, filename, res) {
			storageClient.auth(function(error){
				if(error) {
					console.log('Hubo un error en la conexión con el Object Storage:', error);
				} else {
					var download = storageClient.download({
		                container: ruc,
		                remote: filename
		            });
		            download.pipe(res);
				}
			});
		}
	},
	getEvidenceObjectStorage : pkgcloudStorage({
	  client: storageClient,
	  destination: function (req, file, cb) {
	    cb(null, {
	      container: req.session.user.t_company_ruc,
	      remote: req.correlativo + '/' + file.originalname
	    })
	  }
	})
};

module.exports = objectstorage;