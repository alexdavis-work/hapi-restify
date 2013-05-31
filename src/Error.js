var _ = require('lodash');

/**
 * Index controller
 * Just ping me
 * @type {Function}
 */
var Error = module.exports = function Error(data) {
  this.isRestifyError = true;
  this.message = data.message || 'Error';
  this.code = data.code || 500;
  this.fields = data.fields || null;
  this.data = data.data || null;
};

_.extend(
  Error.prototype,
  {

  }
);
