'use strict';
// Loading dependencies
var nodemailer = require('nodemailer');

// Loading Config
var config = require('./config');

// Transporter Configuration
var initTransporter = function() {
	var smtpConfig = {
	    host: config().smtp.host,
	    port: config().smtp.port,
	    secure: config().smtp.secure,
	    auth: {
	        user: config().smtp.auth.user,
	        pass: config().smtp.auth.pass
	    }
	};
	console.log(smtpConfig);
	return nodemailer.createTransport(smtpConfig);
}

// Email Object to export
var email = {
	sendEmail : function(email, subject, htmlbody) {
		var transporter = initTransporter();
		var mailOptions = {
		    from: config().smtp.from.name + ' <' + config().smtp.from.email + '>',
		    to: email,
		    subject: subject,
		    html: htmlbody
		};
		transporter.sendMail(mailOptions, function(error, info){
			if(error) {
				console.log(email,error);
			} else {
				console.log(email,info);
			}
			transporter.close();
		});
	}
}

module.exports = email;
