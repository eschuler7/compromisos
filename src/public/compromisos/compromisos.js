$(document).ready(function(){
	$('#frmLogin').validate({
		rules : {
			ruc : {
				required : true,
				digits : true,
				maxlength : 11,
				minlength : 11
			},
			userid : {
				required : true,
				maxlength : 15,
				minlength : 5
			},
			password : {
				required : true,
				maxlength : 15,
				minlength : 8
			}
		},
		messages : {
			ruc : {
				required : 'Este campo es requerido',
				digits : 'Ingrese solamente caracteres numéricos',
				maxlength : 'Este campo debe contener 11 caracteres',
				minlength : 'Este campo debe contener 11 caracteres'
			},
			userid : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 15 caracteres',
				minlength : 'Mínimo 5'
			},
			password : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 15 caracteres',
				minlength : 'Mínimo 8 caracteres'
			}
		},
		submitHandler : function(form) {
			form.submit();
		}
	});
	$('#frmResetpwd').validate({
		rules : {
			ruc : {
				required : true,
				digits : true,
				maxlength : 11,
				minlength : 11
			},
			email : {
				required : true,
				maxlength : 20,
				minlength : 5,
				email : true
			}
		},
		messages : {
			ruc : {
				required : 'Este campo es requerido',
				digits : 'Ingrese solamente caracteres numéricos',
				maxlength : 'Este campo debe contener 11 caracteres',
				minlength : 'Este campo debe contener 11 caracteres'
			},
			email : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 100 caracteres',
				minlength : 'Mínimo 5 caracteres',
				email : 'Ingrese un email válido'
			}
		},
		submitHandler : function(form) {
			form.submit();
		}
	});
	$('#frmSignup').validate({
		rules : {
			ruc : {
				required : true,
				digits : true,
				maxlength : 11,
				minlength : 11
			},
			companyname : {
				required : true,
				maxlength : 50,
				minlength : 5
			},
			email : {
				required : true,
				maxlength : 100,
				minlength : 5,
				email : true
			},
			userid : {
				required : true,
				maxlength : 15,
				minlength : 5
			},
			firstname : {
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
			password2 : {
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
				minlength : 'Este campo debe contener 11 caracteres'
			},
			companyname : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 50 caracteres',
				minlength : 'Mínimo 5 caracteres'
			},
			email : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 100 caracteres',
				minlength : 'Mínimo 5 caracteres',
				email : 'Ingrese un email válido'
			},
			userid : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 15 caracteres',
				minlength : 'Mínimo 5'
			},
			firstname : {
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
			password2 : {
				required : 'Este campo es requerido',
				maxlength : 'Máximo 15 caracteres',
				minlength : 'Mínimo 8 caracteres',
				equalTo: 'La contraseña no coincide'
			}
		},
		submitHandler : function(form) {
			form.submit();
		}
	});	
});


