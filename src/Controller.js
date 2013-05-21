var _ = require('lodash'),
    Hapi = require('hapi'),
    Mongoose = require('mongoose');

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
    init: function () {
      // Push REST routes for the controller
      this.router.appRoutes.push({
        method: 'GET', path: '/' + this.name,
        config: { handler: this.getPaginatedCollection.bind(this) }
      });
      this.router.appRoutes.push({
        method: 'POST', path: '/' + this.name,
        config: { handler: this.addModel.bind(this) }
      });
      this.router.appRoutes.push({
        method: 'GET', path: '/' + this.name + '/{id}',
        config: { handler: this.getModel.bind(this) }
      });
      this.router.appRoutes.push({
        method: 'PATCH', path: '/' + this.name + '/{id}',
        config: { handler: this.updateModel.bind(this) }
      });
      this.router.appRoutes.push({
        method: 'DELETE', path: '/' + this.name + '/{id}',
        config: { handler: this.deleteModel.bind(this) }
      });
    },

    getLimit: function(query) {
      var limit = this.router.options.app.display.itemsPerPage;
      if (query && query.limit)  {
        var userLimit = parseInt(query.limit);
        if (userLimit <= this.router.options.app.display.maxItemsPerPage) {
          limit = userLimit;
        }
      }
      return limit;
    },

    getSkip: function(query, limit) {
      var page = (query && query.page) ?
        parseInt(query.page) : 0;
      return page * limit;
    },

    getCollection: function(request) {
      var self = this;
      var limit = this.getLimit(request.query);
      var skip = this.getSkip(request.query, limit);
      this.model
        .find({})
        .limit(limit).skip(skip)
        .exec(function(err, model) {
          self.checkHasBeenFound(
            request, err, model
          );
        });
    },

    getPaginatedCollection: function(request) {
      var self = this;
      var limit = this.getLimit(request.query);
      var skip = this.getSkip(request.query, limit);
      this.model
        .find({})
        .limit(limit).skip(skip)
        .exec(function(err, collection) {
          if (error || !_.isArray(collection)) {
            request.reply(
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
                  parseInt(request.query.page) : 0;
                request.reply(response);
              }
            );
          }
        });
    },

    getModel: function(request) {
      var self = this;
      this.model.findById(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(
            request,
            err, model,
            request.params.id
          );
        }
      );
    },

    deleteModel: function(request) {
      var self = this;
      this.model.findByIdAndRemove(
        request.params.id,
        function(err, model) {
          self.checkHasBeenDeleted(
            request,
            err, model,
            request.params.id,
            function () {
              var response = new Hapi.response.Obj({ deleted: true });
              request.reply(response);
            }
          );
        }
      );
    },

    updateModel: function(request) {
      var self = this;
      this.model.findById(
        request.params.id,
        function(err, model) {
          self.checkHasBeenFound(
            request,
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

    addModel: function(request) {
      var self = this;
      var model = new this.model(
        request.payload
      ).save(
        function(err, model) {
          self.checkHasBeenAdded(
            request,
            err, model,
            request.payload
          );
        }
      );
    },

    findModel: function(request, where, id) {
      this.model.findOne(
        where,
        function(err, model) {
          self.checkHasBeenFound(
            request,
            err, model,
            id || ''
          );
        }
      );
    },

    checkHasBeenFound: function (request, error, model, id, successCallback, errorCallback) {
      this.globalCheck(request, error, model, id, 200, 404,'Item "' + id + '" could not be found', successCallback, errorCallback);
    },

    checkHasBeenAdded: function (request, error, model, params, successCallback, errorCallback) {
      this.globalCheck(request, error, model, params, 201, 400,  'Item could not be created', successCallback, errorCallback);
    },

    checkHasBeenUpdated: function (request, error, model, id, params, successCallback, errorCallback) {
      this.globalCheck(request, error, model, params, 200, 400, 'Item "' + id + '" could not be updated', successCallback, errorCallback);
    },

    checkHasBeenDeleted: function (request, error, model, id, successCallback, errorCallback) {
      this.globalCheck(request, error, model, id, 200, 400, 'Item "' + id + '" could not be deleted', successCallback, errorCallback);
    },

    globalCheck: function (request, error, model, params, validCode, errorCode, message, successCallback, errorCallback) {
      if (error || !model) {
        if (!error) {
          error = new Error(message);
        } else {
          /**
           * TODO : Displaying thrown errors completely
           * @type {Hapi.response.Obj} || {Hapi.error.*}
           * @url https://github.com/spumko/hapi/issues/855
           *
          error = new Hapi.response.Obj(error);
          error.code(400);
          */
        }
        if (typeof errorCallback !== 'function') {
          var response = (errorCode === 404) ?
            new Hapi.error.notFound(error.message) :
            new Hapi.error.badRequest(error.message);
          response.code = errorCode;
          request.reply(response);
        } else {
          errorCallback(error);
        }

      } else {
        if (typeof successCallback !== 'function') {
          var response = new Hapi.response.Obj(model);
          response.code(validCode);
          request.reply(response);
        } else {
          successCallback(model);
        }
      }
    }
  }
);
