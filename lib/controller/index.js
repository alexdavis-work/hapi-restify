var _ = require('lodash')
  , BaseController = require('./base');

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
