'use strict';

// Loading crypto library
var crypto = require('crypto');

// Loading fs library
var fs = require('fs');

// Loading path middleware
var path = require('path');

var createHash = function(type, text) {
	return crypto.createHash(type).update(text).digest('hex');
}

var loadEmailTemplate = function(templateName) {
	var template = '';
	try {
		template = fs.readFileSync(path.resolve('templates/template_' + templateName + '.html'), 'utf8');
	} catch (e) {
		console.log('[util]','[loadEmailTemplate]',e);
	}
	return template;
}

var handleError = function(res, e) {
	res.render('partial/msghandler/error',{error: e});
}

var checktype = function(object) {
    var cache = {};
    var key;
    return (key = typeof object) !== 'object' ? key
            : cache[key = ({}).toString.call(object)]
            || (cache[key] = key.slice(8, -1).toLowerCase());
}

module.exports.createHash = createHash;
module.exports.loadEmailTemplate = loadEmailTemplate;
module.exports.checktype = checktype;