/**
 * Dependencies
 */
var _ = require('lodash')
  , Mongoose = require('mongoose')
  , Hapi = require('hapi')
  , Router = require('./Router');

/**
 * Restify Application
 * @type {Function}
 */
var Application = module.exports = function Application(options, readyCallback) {
  this.options = options;
  return this.createServer()
    .createDatabase()
    .load(readyCallback);
};

_.extend(
  Application.prototype,
  {
    createServer: function () {
      // Server init
      this.server = new Hapi.Server(
        this.options.app.host,
        parseInt(this.options.app.port),
        this.options || {}
      );
      return this;
    },

    createDatabase: function () {
      // Database connection
      this.server.db = Mongoose.createConnection(
        'mongodb://' + this.options.app.db.host +
          ':' + this.options.app.db.port +
          '/' + this.options.app.db.name
      );
      return this;
    },

    load: function(callback) {
      // Walk directories to find
      // controllers & models
      var router = new Router(
        _.extend(
          this.options,
          { db: this.server.db }
        )
      );
      var self = this;
      router.findModels(
        function () {
          router.findControllers(
            function () {
              // Adding resultant routes
              self.server.addRoutes(
                router.getRoutes()
              );
              if (typeof self.options.app.init === 'function') {
                self.options.app.init.call(this);
              }
              if (typeof callback === 'function') {
                callback();
              }
            }
          );
        }
      );
      return this;
    },

    start: function(callback) {
      this.server.start(callback);
      return this;
    }
  }
);