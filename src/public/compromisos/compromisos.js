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
				minlength : 5
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
				maxlength : 20,
				minlength : 5
			},
			email : {
				required : true,
				maxlength : 20,
				minlength : 5
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
			},			
			password2 : {
				required : true,
				maxlength : 15,
				minlength : 8
			}			
		},
		submitHandler : function(form) {
			form.submit();
		}
	});	
});



