var _ = require('lodash')
  , Hapi = require('hapi')
  , Mongoose = require('mongoose');

/**
 * Base Controller
 * Handles basic REST methods
 * @type {Function}
 */
var Controller = module.exports = function Controller(options) {
  this.name = options.name;
  this.db = options.db;
  if (!options || !options.noModel) {
    this.model = this.db.model(this.name);
  }
  this.router = options.router;
};

_.extend(
  Controller.prototype,
  {
    init: function () {},

    /**
     * TODO : Add correct HTTP responses codes and headers
     */

    getCollection: function(request) {
      var self = this;
      this.model.find(
        {},
        function(err, model) {
          self.checkHasBeenFound(err, model, request.reply);
        }
      );
    },

    getModel: function(request) {
      var self = this;
      this.model.findById(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(err, model, request.reply);
        }
      );
    },

    deleteModel: function(request) {
      var self = this;
      this.model.findByIdAndRemove(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(err, model, request.reply);
        }
      );
    },

    updateModel: function(request) {
      var self = this;
      this.model.findById(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(
            err, model,
            function(model) {
              model.set(
                request.payload
              )
              model.save(
                function(err, model) {
                  self.checkHasBeenUpdated(
                    err, model,
                    request.payload,
                    request.reply
                  );
                }
              );
            },
            request.reply
          );
        }
      );
    },

    addModel: function(request) {
      var self = this;
      var model = new this.model(
        request.payload
      ).save(
        function(err, model) {
          self.checkHasBeenUpdated(
            err, model,
            request.payload,
            request.reply
          );
        }
      );
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

    checkHasBeenFound: function (error, model, successCallback, errorCallback) {
      if (!errorCallback) {
        errorCallback = successCallback;
      }
      if (error || !model) {
        if (!error) {
          error = new Error('Item could not be found');
        }
        var response = new Hapi.error.notFound(error.message);
        response.code = 404;
        errorCallback(response);
      } else {
        successCallback(model);
      }
    },

    checkHasBeenUpdated: function (error, model, params, successCallback, errorCallback) {
      if (!errorCallback) {
        errorCallback = successCallback;
      }
      if (error || !model) {
        if (!error) {
          error = new Error('Item could not be created');
        }
        var response = new Hapi.error.badRequest(error.message);
        response.code = 500;
        errorCallback(response);
      } else {
        successCallback(model);
      }
    }
  }
);
