$.validator.addMethod("notEqualTo", function(value, element, param) {
	return value != $(param).val();
}, "Value must not be the same");

$.validator.addMethod("validaterol", function(value, element, param) {
	return value != param;
}, "Debe seleccionar un rol");
$.validator.addMethod("totalsizemax", function(value, element, param) {
	var totalsize = 0;
	for (var i=0; i < element.files.length; i++){
		totalsize += element.files[i].size;
	}
	return totalsize < param;
}, "Max files size superated, only 200 Mb allowed.");
$.validator.addMethod("multiemail",function(value, element, param) {
	var emails = value.split(/[;,]+/); // split email by , or ;
	valid = true;
	for (var i in emails) {
		value = emails[i];
		valid = valid && $.validator.methods.email.call(this, $.trim(value), element);
	}
	return valid;
},jQuery.validator.messages.email);
/*
$.validator.addMethod("validatecheckbox", function(value, element, param) {
	return value != param;
}, "Debe seleccionar una opción");
*/
//var htmlSpinner = '<i class="fa fa-refresh fa-spin"></i>';
$(document).ready(function(){
	// Start Wizard Validations
	$('#frmstep1').validate({
		rules : {
			razonsocial : {
				required : true
			},
			unidadinit : {
				required : true
			},
			proyoper : {
				required : true
			}
		}
	});
	// End Wizard Validations
	$('#frmLogin').validate({
		rules : {
			userid : {
				required : true,
				maxlength : 20,
				minlength : 5
			},
			password : {
				required : true,
				minlength : 8
			}
		},
		messages : {
			userid : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 20 caracteres',
				minlength : 'Mínimo 5 caracteres'
			},
			password : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 8 caracteres'
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html('Iniciando ...');
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
	$('#frmChangePwd').validate({
		rules : {
			password : {
				required : true,
				minlength : 8
			},
			newpassword : {
				required : true,
				minlength : 8,
				notEqualTo : '#password'
			},
			retype_newpassword : {
				required : true,
				minlength : 8,
				equalTo : '#newpassword'
			}
		},
		messages : {
			password : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 8 caracteres'
			},
			newpassword : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 8 caracteres',
				notEqualTo : 'No se puede reutilizar la contraseña'
			},
			retype_newpassword : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 8 caracteres',
				equalTo : 'La contraseña no coincide'
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html('En proceso ...');
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
	$('#frmResetpwd').validate({
		rules : {
			email : {
				required : true,
				email : true
			}
		},
		messages : {
			email : {
				required : 'Este campo es requerido',
				email : 'Ingrese un email válido'
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html('En proceso ...');
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
	$('#frmuserscreate').validate({
		rules : {
			userid : {
				required : true,
				maxlength : 20,
				minlength : 5,
				remote : {
					url : "validateuserid",
					type : "post",
					data : {
						userid : function() {
			            	return $( "#userid" ).val();
			        	}
					}
				}
			},
			email : {
				required : true,
				email : true
			},
			name : {
				required : true,
				maxlength : 20,
				minlength : 2
			},
			lastname : {
				required : true,
				maxlength : 20,
				minlength : 2
			},
			rol : {
				required : true,
				validaterol : 'ROL0'
			},
			password : {
				required : true,
				minlength : 8
			}
		},
		messages : {
			userid : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 20 caracteres',
				minlength : 'Mínimo 5 caracteres',
				remote : 'El id ya existe en la base de datos'
			},
			email : {
				required : 'Este campo es requerido',
				email : 'Ingrese un email válido'
			},
			name : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 20 caracteres',
				minlength : 'Mínimo 2 caracteres'
			},
			lastname : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 20 caracteres',
				minlength : 'Mínimo 2 caracteres'
			},
			rol : {
				required : 'Seleccione una opción',
			},
			password : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 8 caracteres'
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html('En proceso ...');
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
	$('#frmregisterCommit').validate({
		rules : {
			evidencias : {
				totalsizemax : 209715200
			},
			correosnotificacion : {
				multiemail : true
			}
		},
		messages : {
			evidencias : {
				totalsizemax : 'Solo se puede adjuntar un máximo 200 mb en archivos'
			},
			correosnotificacion : {
				multiemail : 'Ingrese correo válido'
			}

		},
		errorPlacement : function(error, element) {
			var ref = element;
			if ($(element).attr('name') == 'evidencias') {
				ref = $('#evidencias');
			}
			error.insertAfter(ref);
		},
		submitHandler : function(form) {
			submitAjaxForm(form,'/secure/commitlist');
		}
	});
	$('#frmeditCommit').validate({
		rules : {
			evidencias : {
				totalsizemax : 209715200
			},
			correosnotificacion : {
				multiemail : true
			}
		},
		messages : {
			evidencias : {
				totalsizemax : 'Solo se puede adjuntar un máximo 200 mb en archivos'
			}
		},
		errorPlacement : function(error, element) {
			var ref = element;
			if ($(element).attr('name') == 'evidencias') {
				ref = $('#evidencias');
			}
			error.insertAfter(ref);
		},
		submitHandler : function(form) {
			submitAjaxForm(form,'/secure/commitlist');
		}
	});
	$('#frmregisterMonit').validate({
		rules : {
			evidencias : {
				totalsizemax : 209715200
			},
			notificacion : {
				multiemail : true
			}
		},
		messages : {
			evidencias : {
				totalsizemax : 'Solo se puede adjuntar un máximo 200 mb en archivos'
			}
		},
		errorPlacement : function(error, element) {
			var ref = element;
			if ($(element).attr('name') == 'evidencias') {
				ref = $('#evidencias');
			}
			error.insertAfter(ref);
		},
		submitHandler : function(form) {
			submitAjaxForm(form,'/secure/monitlist');
		}
	});
	$('#frmeditMonitor').validate({
		rules : {
			evidencias : {
				totalsizemax : 209715200
			},
			notificacion : {
				multiemail : true
			}
		},
		messages : {
			evidencias : {
				totalsizemax : 'Solo se puede adjuntar un máximo 200 mb en archivos'
			}
		},
		errorPlacement : function(error, element) {
			var ref = element;
			if ($(element).attr('name') == 'evidencias') {
				ref = $('#evidencias');
			}
			error.insertAfter(ref);
		},
		submitHandler : function(form) {
			submitAjaxForm(form,'/secure/monitlist');
		}
	});
	$('#frmcommitmasive').validate({
		rules : {
			template : {
				required : true
			}
		},
		messages : {
			template : {
				required : 'Este campo es requerido'
			}
		},
		errorPlacement : function(error, element) {
			var ref = element;
			if ($(element).attr('name') == 'template') {
				ref = $('#carga');
			}
			error.insertAfter(ref);
		},
		submitHandler : function(form) {
			submitMassiveForm(form,'/secure/commitlist');
		}
	});
	$('#frmmonitmasive').validate({
		rules : {
			template : {
				required : true
			}
		},
		messages : {
			template : {
				required : 'Este campo es requerido'
			}
		},
		errorPlacement : function(error, element) {
			var ref = element;
			if ($(element).attr('name') == 'template') {
				ref = $('#carga');
			}
			error.insertAfter(ref);
		},
		submitHandler : function(form) {
			submitMassiveForm(form,'/secure/monitlist');
		}
	});
});
var submitMassiveForm = function(form, urlRedirect) {
	var btnSubmit = $(form).find(':submit');
	var width = btnSubmit.css('width');
	btnSubmit.css('width',width);
    btnSubmit.html('En proceso ...');
    btnSubmit.attr('disabled',true);
    $('#pbcontainer').css('display','block');
	//form.submit();
	var formData = new FormData(form);
    $.ajax({
        type:'POST',
        url:$(form).attr('action'),
        data:formData,
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
                myXhr.upload.addEventListener('progress',massiveprogress, false);
            }
            return myXhr;
        },
        cache:false,
        contentType: false,
        processData: false,
        success:function(data){
        	btnSubmit.html('Finalizado');
        },
        error: function(err){
            console.log(data);
        },
        complete: function(){
        	btnSubmit.html('Redireccionando ...');
        	window.location = urlRedirect;
        }
    });
}
function massiveprogress(e){
    if(e.lengthComputable){
        var max = e.total;
        var current = e.loaded;

        var Percentage = Math.ceil((current * 100)/max);
        $('#progressbar').css('width',Percentage + '%');
      	$('#progressbar').html('Progreso: ' + Percentage + '%');
        if(Percentage >= 100)
        {
           $('#progressbar').html('Carga finalizada, registrando en base de datos, esto puede tardar unos minutos, por favor espere');
        }
    }  
}

var submitAjaxForm = function(form, urlRedirect) {
	var btnSubmit = $(form).find(':submit');
	var width = btnSubmit.css('width');
	btnSubmit.css('width',width);
    btnSubmit.html('En proceso ...');
    btnSubmit.attr('disabled',true);
    $('#pbcontainer').css('display','block');
	//form.submit();
	var formData = new FormData(form);
    $.ajax({
        type:'POST',
        url:$(form).attr('action'),
        data:formData,
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
                myXhr.upload.addEventListener('progress',progress, false);
            }
            return myXhr;
        },
        cache:false,
        contentType: false,
        processData: false,
        success:function(data){
        	btnSubmit.html('Finalizado');
        },
        error: function(err){
            console.log(data);
        },
        complete: function(){
        	btnSubmit.html('Redireccionando ...');
        	window.location = urlRedirect;
        }
    });
}

function progress(e){
    if(e.lengthComputable){
        var max = e.total;
        var current = e.loaded;

        var Percentage = Math.ceil((current * 100)/max);
        $('#progressbar').css('width',Percentage + '%');
      	$('#progressbar').html('Progreso: ' + Percentage + '%');
        if(Percentage >= 100)
        {
           $('#progressbar').html('Registro/Actualización Finalizado');
        }
    }  
}

;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));