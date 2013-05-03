var _ = require('lodash')
,   Mongoose = require('mongoose');

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
    /**
     * TODO : Add correct HTTP responses codes and headers
     */

    getCollection: function(request) {
      if (request.query.name) {
        request.reply(
          this.findModel(request)
        );
      } else {
        this.model.find(
          {},
          function(err, model) {
            request.reply(err || model);
          }
        )
      }
    },

    findModel: function(request) {
      this.model.findOne(
        {
          name: request.query.name
        },
        function(err, model) {
          request.reply(err || model);
        }
      );
    },

    getModel: function(request) {
      this.model.findById(
        request.params.id,
        function(err, model) {
          request.reply(
            err || model || {
              error: 'notfound'
            }
          );
        }
      );
    },

    addModel: function(request) {
      var model = new this.model(
        request.payload
      ).save(
        function(err, savedModel) {
          if (err || !savedModel) {
            request.reply({
              error: err || true,
              params: request.payload
            });
          } else {
            request.reply(savedModel);
          }
        }
      );
    },

    deleteModel: function(request) {
      this.model.remove(
        request.params.id,
        function(err, model) {
          if (err) {
            request.reply(err);
          } else {
            request.reply({
              done: (err === null)
            });
          }
        }
      );
    },

    updateModel: function(request) {
      this.model.findById(
        request.params.id,
        function(err, model) {
          model.set(
            request.payload
          )
          model.save(
            function(err, model) {
              request.reply({
                done: (err === null)
              });
            }
          );
        }
      );
    }
  }
);
