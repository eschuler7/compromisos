$.validator.addMethod("notEqualTo", function(value, element, param) {
	return value != $(param).val();
}, "Value must not be the same");

$(document).ready(function(){
	$('#frmLogin').validate({
		rules : {
			userid : {
				required : true,
				maxlength : 20,
				minlength : 5
			},
			password : {
				required : true,
				minlength : 6
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
				minlength : 'Mínimo 6 caracteres'
			}
		},
		submitHandler : function(form) {
			form.submit();
		}
	});
	$('#frmChangePwd').validate({
		rules : {
			password : {
				required : true,
				minlength : 6
			},
			newpassword : {
				required : true,
				minlength : 6,
				notEqualTo : '#password'
			},
			retype_newpassword : {
				required : true,
				minlength : 6,
				equalTo : '#newpassword'
			}
		},
		messages : {
			password : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 6 caracteres'
			},
			newpassword : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 6 caracteres',
				notEqualTo : 'No se puede reutilizar la contraseña'
			},
			retype_newpassword : {
				required : 'Este campo es requerido',
				minlength : 'Mínimo 6 caracteres',
				equalTo : 'La contraseña no coincide'
			}
		},
		submitHandler : function(form) {
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
			form.submit();
		}
	});
});


