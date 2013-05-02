var _ = require('lodash')
  , BaseController = require('./base');

/**
 * Index controller
 * Just ping me
 * @type {Function}
 */
var IndexController = module.exports = function IndexController() {};

_.extend(
  IndexController.prototype,
  {
    indexAction: function (request) {
      request.reply({
        ping: true
      });
    }
  }
);
