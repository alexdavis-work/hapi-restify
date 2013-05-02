var _ = require('lodash')
  , BaseController = require('./base');

var IndexController = module.exports = function IndexController(options) {
  BaseController.prototype.constructor.call(this, options);
};

_.extend(
  IndexController.prototype,
  {
    indexAction: function () {
      request.reply({
        ping: true
      });
    }
  }
);
