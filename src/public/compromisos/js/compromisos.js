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

;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
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