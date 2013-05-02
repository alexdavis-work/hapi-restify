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
      var self = this;
      this.models = {};
      fs.readdir(this.options.models.path, function (err, files) {
        files.forEach(function (file) {
          if (file[0] !== '.') {
            var fileName = file.replace('.js', '');
            self.models[fileName] = self.options.models.path + '/' + file;
          }
        });
        callback();
      });
    },

    initialize: function () {
      this.appRoutes = [];
      for (name in this.models) {
        console.log('Registering model "' + name + '"');
        var modelClass = require(
          this.models[name]
        );
        var model = modelClass(mongoose);

        console.log('Registering controller "' + name + '"');
        var ctlrOpts = {
          name: name,
          db: this.options.db
        };
        if (false) {
          var controllerClass = require(
            this.options.controllers.path + name
          );
        } else {
          var controllerClass = BaseController;
        }
        var controller = new controllerClass(ctlrOpts);

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
    }
  }
);
