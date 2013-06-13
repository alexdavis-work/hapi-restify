var _ = require('lodash')
  , Controller = require('./../Controller');

/**
 * Index controller
 * Just ping me
 * @type {Function}
 */
var IndexController = module.exports = function IndexController() {
  Controller.prototype.constructor.apply(this, arguments);
};

_.extend(
  IndexController.prototype,
  Controller.prototype
);

_.extend(
  IndexController.prototype,
  {
    init: function () {
      this.app.routes.push({
        method: 'GET', path: '/',
        config: { handler: this.indexAction.bind(this) }
      });
    },

    indexAction: function (request) {
      request.reply({
        ping: true
      });
    }
  }
);
