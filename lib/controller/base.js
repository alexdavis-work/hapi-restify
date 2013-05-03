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
          request.reply(err || model);
        }
      );
    },

    addModel: function(request) {
      var model = this.model();
      request.payload;
      model.set(
        request.payload
      )
      model.save(
        function(err, model) {
          if (err) {
            request.reply(err);
          } else {
            request.reply.created(
              '/' + this.name + '/' + model._id
            )(model);
          }
        }
      );
    },

    deleteModel: function(request) {
      this.model.findById(
        request.params.id,
        function(err, model) {
          model.save(
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
