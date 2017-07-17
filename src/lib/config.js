'use strict';

//Define modules
var fs = require('fs');
var yaml = require('js-yaml');
var environment = require('./env');
var config = yaml.safeLoad(fs.readFileSync(__dirname + '/../config/config.yml', 'utf-8'));

console.log('Environment:',environment().name);

module.exports = function() {
	return config[environment().name] || {};
}