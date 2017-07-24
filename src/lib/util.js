'use strict';

// Loading crypto library
var crypto = require('crypto');

var createHash = function(type, text) {
	return crypto.createHash(type).update(text).digest("hex");
}