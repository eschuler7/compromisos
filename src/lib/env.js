'use strict';

module.exports = function() {
	return {
		name: process.env.NODENV ? process.env.NODENV : 'prod'
	}
}