$.validator.addMethod("multiemail",function(value, element, param) {
	var emails = value.split(/[;,]+/); // split email by , or ;
	valid = true;
	for (var i in emails) {
		value = emails[i];
		valid = valid && $.validator.methods.email.call(this, $.trim(value), element);
	}
	return valid;
},jQuery.validator.messages.email);

var htmlSpinner = '<i class="fa fa-refresh fa-spin"></i>';
$(document).ready(function(){
	$('#demo-form2').validate({
		rules : {
			ruc : {
				required : true,
				digits : true,
				maxlength : 11,
				minlength : 11,
				remote : {
					url : "validateruc",
					type : "post",
					data : {
						ruc : function() {
			            	return $( "#ruc" ).val();
			        	}
					}
				}
			},
			companyname : {
				required : true,
				maxlength : 50,
				minlength : 5
			},
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
				maxlength : 100,
				minlength : 5,
				email : true
			},
			name : {
				required : true,
				maxlength : 50,
				minlength : 2
			},
			lastname : {
				required : true,
				maxlength : 50,
				minlength : 2
			},
			password : {
				required : true,
				maxlength : 15,
				minlength : 8
			},
			retype_password : {
				required : true,
				maxlength : 15,
				minlength : 8,
				equalTo: "#password"
			}
		},
		messages : {
			ruc : {
				required : 'Este campo es requerido',
				digits : 'Ingrese solamente caracteres numéricos',
				maxlength : 'Este campo debe contener 11 caracteres',
				minlength : 'Este campo debe contener 11 caracteres',
				remote : 'El RUC ya existe en la base de datos'
			},
			companyname : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 50 caracteres',
				minlength : 'Mínimo 5 caracteres'
			},
			userid : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 20 caracteres',
				minlength : 'Mínimo 5 caracteres',
				remote : 'El id ya existe en la base de datos'
			},
			email : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 100 caracteres',
				minlength : 'Mínimo 5 caracteres',
				email : 'Ingrese un email válido'
			},
			name : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 50 caracteres',
				minlength : 'Mínimo 2 caracteres'
			},
			lastname : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 50 caracteres',
				minlength : 'Mínimo 2 caracteres'
			},
			password : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 15 caracteres',
				minlength : 'Mínimo 8 caracteres'
			},
			retype_password : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 15 caracteres',
				minlength : 'Mínimo 8 caracteres',
				equalTo: 'La contraseña no coincide'
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html(htmlSpinner);
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
	$('#frm_support_email').validate({
		rules : {
			supportemails : {
				required : true,
				multiemail : true
			}
		},
		messages : {
			supportemails : {
				required : 'Este campo es requerido',
				multiemail : 'Ingrese el correo electrónico correcto.'
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html('Guardando ...');
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
});

$(document).ready(function(){
	$('#frm_support_email').validate({
		rules : {
			supportemail : {
				required : true,
				multiemail : true
			}
		},
		submitHandler : function(form) {
			var btnSubmit = $(form).find(':submit');
			var width = btnSubmit.css('width');
			btnSubmit.css('width',width);
	        btnSubmit.html(htmlSpinner);
	        btnSubmit.attr('disabled',true);
			form.submit();
		}
	});
});