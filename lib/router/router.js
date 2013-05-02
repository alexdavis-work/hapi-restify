var _ = require('lodash')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , BaseController = require('./../controller/base');

var Router = module.exports = function Router(options) {
  this.options = options;
};

_.extend(
  Router.prototype,
  {

    findModels: function (callback) {
      this.walkDir(
        'models',
        this.options.models.path,
        function(path, file, array) {
          array[file] = require(path);
        },
        callback
      );
    },

    findControllers: function (callback) {
      this.walkDir(
        'controllers',
        this.options.controllers.path,
        function(path, file, array) {
          array[file] = require(path);
        },
        callback
      );
    },

    addIndexController: function () {
      var controllerClass = require(
        './../controller/index'
      );
      var controller = new controllerClass();
      this.appRoutes.push({
        method: 'GET', path: '/',
        config: { handler: controller.indexAction.bind(controller) }
      });
    },

    initialize: function () {
      this.appRoutes = [];
      this.addIndexController();
      for (name in this.models) {
        // Instantiate model/controller
        // for the current schema
        this.models[name](mongoose);
        if (this.controllers[name]) {
          var controllerClass = this.controllers[name];
        } else {
          var controllerClass = BaseController;
        }
        var controller = new controllerClass({
          name: name,
          db: this.options.db
        });
        // Push REST routes for the controller
        this.appRoutes.push({
          method: 'GET', path: '/' + name,
          config: { handler: controller.getCollection.bind(controller) }
        });
        this.appRoutes.push({
          method: 'GET', path: '/' + name + '/{id}',
          config: { handler: controller.getModel.bind(controller) }
        });
      }
      return this;
    },

    getRoutes: function () {
      if (!this.appRoutes) {
        this.initialize();
      }
      return this.appRoutes;
    },

    walkDir: function(type, dir, processFn, callback) {
      var self = this;
      this[type] = {};
      fs.readdir(dir, function (err, files) {
        files.forEach(function (file) {
          if (file[0] !== '.') {
            var fileName = file.replace('.js', '');
            console.log('Registering ' + type + ': "' + fileName + '"');
            self[type][fileName] = dir + '/' + file;
          }
        });
        if (typeof processFn === 'function') {
          _.each(self[type], processFn);
        }
        callback();
      });
    }
  }
);
