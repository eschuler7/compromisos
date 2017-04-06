var twilio = require('twilio');

function initTwilioClient() {
	// Twilio Credentials 
	var client;
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		if(vcapServices['user-provided']){
			twilio_credentials = vcapServices['user-provided'][0].credentials;
			client = new twilio.RestClient(twilio_credentials.accountSID, twilio_credentials.authToken);
		}
	} else{
		//console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
		var accountSid = 'ACdc7553127aba8bd68f6185a8bbd81d08';
		var authToken = 'f19dfa95f6c8ce17256965f6be944354';
		client = new twilio.RestClient(accountSid, authToken);
	}
	return client;
}

module.exports.initTwilioClient = initTwilioClient;