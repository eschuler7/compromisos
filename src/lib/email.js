'use strict';
// Loading Config
var config = require('./config');
//Sendgrid
var sgMail = require('@sendgrid/mail');
// key initialization
sgMail.setApiKey(config().sendgrid.apikey);

console.log(config().sendgrid.name);

var email = {
	sendEmail : function(email, subject, htmlbody) {
		const msg = {
			from: config().sendgrid.name + ' <' + config().sendgrid.from + '>',
			to: email,
			subject: subject,
			html: htmlbody
		};
		sgMail.send(msg);
	}
}
module.exports = email;

/*// Loading dependencies
var nodemailer = require('nodemailer');
// Loading Config
var config = require('./config');

// Transporter Configuration
var smtpConfig = {
    host: config().smtp.host,
    port: config().smtp.port,
    secure: config().smtp.secure,
    auth: {
        user: config().smtp.auth.user,
        pass: config().smtp.auth.pass
    }
};

// Email Object to export
var email = {
	sendEmail : function(email, subject, htmlbody) {
		var transporter = nodemailer.createTransport(smtpConfig);
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

module.exports = email;*/