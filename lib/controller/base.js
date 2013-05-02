var _ = require('lodash')
,   mongoose = require('mongoose');

/**
 * Base Controller
 * Handles basic REST methods
 * @type {Function}
 */
var BaseController = module.exports = function BaseController(options) {
  this.name = options.name;
  this.db = options.db;
  this.model = this.db.model(this.name);
};

_.extend(
  BaseController.prototype,
  {

    getCollection: function(request) {
      if (request.query.name) {
        request.reply(
          this.findProperties(request.query.name)
        );
      } else {
        this.model.find(
          {},
          function(err, data) {
            request.reply(data);
          }
        )
      }
    },

    findModel: function(name) {
      this.model.findOne(
        {
          name: name
        },
        function(err, data) {
          request.reply(data);
        }
      );
    },

    getModel: function(request) {
      this.model.findById(
        request.params.id,
        function(err, data) {
          request.reply(data);
        }
      );
    },

    addModel: function(request) {
      var model = request.payload;

      request.reply.created('/' + this.name + '/' + 'id')({
        id: 0
      });
    }
  }
);
