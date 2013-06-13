/**
 * Dependencies
 */
var _ = require('lodash')
  , Mongoose = require('mongoose')
  , Hapi = require('hapi')
  , Router = require('./Router')
  , Controller = require('./Controller');

/**
 * Restify Application
 * @type {Function}
 */
var Application = module.exports = function Application(settings, readyCallback) {
  this.settings = settings;
  this.routes = [];
  this.models = {};
  this.controllers = {};
  return this.createServer()
    .createDatabase()
    .initialize(readyCallback);
};

_.extend(
  Application.prototype,
  {
    createServer: function () {
      // Server init
      this.server = new Hapi.Server(
        this.settings.app.host,
        parseInt(this.settings.app.port),
        this.settings || {}
      );
      return this;
    },

    createDatabase: function () {
      // Database connection
      this.db = Mongoose.createConnection(
        'mongodb://' + this.settings.app.db.host +
          ':' + this.settings.app.db.port +
          '/' + this.settings.app.db.name,
        this.settings.app.db.options || {}
      );
      return this;
    },

    initialize: function(callback) {
      this.router = new Router(
        this.settings.app.models.path,
        this.settings.app.controllers.path
      );
      var self = this;
      this.router.searchModules(
        function () {
          self.createModules();
          self.recognizeRestifyErrors();
          self.startCustomInitialization();
          self.server.addRoutes(
            self.routes
          );
          if (typeof callback === 'function') {
            callback();
          }
        }
      );
      return this;
    },

    createModules: function () {
      // Instantiate model/controller
      // for the current schema
      return this.initModels().initControllers();
    },

    initModels: function () {
      for (var name in this.router.models) {
        this.models[name] = this.router.models[name](Mongoose);
      }
      return this;
    },

    initControllers: function () {
      for (var name in this.router.controllers) {
        if (this.router.controllers[name]) {
          this.controllers[name] = new this.router.controllers[name](name, this);
        } else {
          this.controllers[name] = new Controller(name, this);
        }
        this.controllers[name].init();
      }
      return this;
    },

    recognizeRestifyErrors: function () {
      this.server.ext('onPreResponse', function (request, next) {
        var response = request.response();
        if (response.raw && response.raw.isRestifyError) {
          delete response.raw.isRestifyError;
          response.code(response.raw.code);
          response._payload = [ JSON.stringify(response.raw) ];
        }
        return next();
      });
    },

    startCustomInitialization: function () {
      if (typeof this.settings.app.init === 'function') {
        this.settings.app.init.call(this);
      }
      return this;
    },

    start: function(callback) {
      this.server.start(callback);
      return this;
    }
  }
);