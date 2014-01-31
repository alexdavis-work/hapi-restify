var _ = require('lodash'),
    Hapi = require('hapi'),
    Mongoose = require('mongoose'),
    Error = require('./Error');

/**
 * Base Controller
 * Handles basic REST methods
 * @type {Function}
 */
var Controller = module.exports = function Controller(name, app) {
  this.name = name;
  this.app = app;
  if (this.app.models[name]) {
    this.model = this.app.db.model(this.name);
  }
  this.collectionNotPaginated = false;
};

_.extend(
  Controller.prototype,
  {
    init: function () {
      // Push REST routes for the controller
      var collectionMethod = (this.collectionNotPaginated) ?
        'getCollection' : 'getPaginatedCollection';
      this.app.routes.push({
        method: 'GET', path: '/' + this.name,
        config: { handler: this[collectionMethod].bind(this) }
      });
      this.app.routes.push({
        method: 'POST', path: '/' + this.name,
        config: { handler: this.addModel.bind(this) }
      });
      this.app.routes.push({
        method: 'GET', path: '/' + this.name + '/{id}',
        config: { handler: this.getModel.bind(this) }
      });
      this.app.routes.push({
        method: 'PATCH', path: '/' + this.name + '/{id}',
        config: { handler: this.updateModel.bind(this) }
      });
      this.app.routes.push({
        method: 'DELETE', path: '/' + this.name + '/{id}',
        config: { handler: this.deleteModel.bind(this) }
      });
    },

    getLimit: function(paramList) {
      var limit = this.app.settings.app.display.itemsPerPage;
      if (paramList && paramList.limit)  {
        var userLimit = parseInt(paramList.limit);
        if (userLimit <= this.app.settings.app.display.maxItemsPerPage) {
          limit = userLimit;
        }
      }
      return limit;
    },

    getSkip: function(paramList, limit) {
      var page = (paramList && paramList.page > 0) ?
        parseInt(paramList.page) : 1;
      return (page - 1) * limit;
    },

    getCollection: function(request, reply) {
      var self = this;
      //var attributes = {};
      var limit = this.getLimit(request.query);
      var skip = this.getSkip(request.query, limit);
      this.model
        .find()//attributes)
        .limit(limit).skip(skip)
        .exec(function(err, model) {
          self.checkHasBeenFound(
            request, reply, err, model
          );
        });
    },

    getPaginatedCollection: function(request, reply) {
      var self = this;
      //if (!attributes) { attributes = {}; }
      var limit = this.getLimit(request.query);
      var skip = this.getSkip(request.query, limit);
      this.model
        .find()//attributes)
        .limit(limit).skip(skip)
        .exec(function(err, collection) {
          if (err || !_.isArray(collection)) {
            reply(
              new Hapi.error.internal(
                'Error retrieving collection'
              )
            );
          } else {
            self.model.count({}).exec(
              function(err, total) {
                var response = {};
                response.data = collection;
                response.items = total;
                response.pages = Math.ceil(total/limit);
                response.currentPage =  (request.query && request.query.page) ?
                  parseInt(request.query.page) : 1;
                reply(response);
              }
            );
          }
        });
    },

    getModel: function(request, reply) {
      var self = this;
      this.model.findById(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(
            request,
            reply,
            err, model,
            request.params.id
          );
        }
      );
    },

    deleteModel: function(request, reply) {
      var self = this;
      this.model.findByIdAndRemove(
        request.params.id,
        function(err, model) {
          self.checkHasBeenDeleted(
            request,
            reply,
            err, model,
            request.params.id,
            function () {
              var response = new Hapi.response.Obj({ deleted: true });
              reply(response);
            }
          );
        }
      );
    },

    updateModel: function(request, reply) {
      var self = this;
      this.model.findById(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(
            request,
            reply,
            err, model,
            request.params.id,
            function(model) {
              model.set(
                request.payload
              );
              model.save(
                function(err, model) {
                  self.checkHasBeenUpdated(
                    request,
                    err, model,
                    request.params.id,
                    request.payload
                  );
                }
              );
            }
          );
        }
      );
    },

    addModel: function(request, reply) {
      var self = this;
      var model = new this.model(
        request.payload
      ).save(
        function(err, model) {
          self.checkHasBeenAdded(
            request,
            reply,
            err, model,
            request.payload
          );
        }
      );
    },

    findModel: function(request, reply, where, id) {
      this.model.findOne(
        where,
        function(err, model) {
          self.checkHasBeenFound(
            request,
            reply,
            err, model,
            id || ''
          );
        }
      );
    },

    checkHasBeenFound: function (request, reply, error, model, id, successCallback, errorCallback) {
      this.globalCheck(request, reply, error, model, id, 200, 404,'Item "' + id + '" could not be found', successCallback, errorCallback);
    },

    checkHasBeenAdded: function (request, reply, error, model, params, successCallback, errorCallback) {
      this.globalCheck(request, reply, error, model, params, 201, 400,  'Item could not be created', successCallback, errorCallback);
    },

    checkHasBeenUpdated: function (request, reply, error, model, id, params, successCallback, errorCallback) {
      this.globalCheck(request, reply, error, model, params, 200, 400, 'Item "' + id + '" could not be updated', successCallback, errorCallback);
    },

    checkHasBeenDeleted: function (request, reply, error, model, id, successCallback, errorCallback) {
      this.globalCheck(request, reply, error, model, id, 200, 400, 'Item "' + id + '" could not be deleted', successCallback, errorCallback);
    },

    globalCheck: function (request, reply, error, model, params, validCode, errorCode, message, successCallback, errorCallback) {
      if (error || !model) {
        if (!error) {
          error = new Error(message);
        } else {
          console.log(error);
        }
        if (typeof errorCallback !== 'function') {
          var response = new Error(
            _.extend(
              error,
              {
                message: message || error.message,
                code: errorCode,
                type: error.name || null,
                data: error.errors || null
              }
            )
          );
          reply(response);
        } else {
          errorCallback(error);
        }

      } else {
        if (typeof successCallback !== 'function') {
          reply(model);
          // var response = new Hapi.response.Obj(model);
          // response.code(validCode);
          // reply(response);
        } else {
          successCallback(model);
        }
      }
    }
  }
);
