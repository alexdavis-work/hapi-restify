var _ = require('lodash');

/**
 * Base error
 * @type {Function}
 */
var Error = module.exports = function Error(data) {
	this.isRestifyError = true;
	this.message = data.message || 'Error';
	this.code = data.code || 500;
	this.data = data.data || null;
	this.type = data.type || null;
};
