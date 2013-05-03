/**
 * Dependencies
 */
var _ = require('lodash')
  , Mongoose = require('mongoose')
  , Hapi = require('hapi')
  , Router = require('./lib/router/router');

/**
 * RestHapiServer
 * Creates the REST Hapi server
 * with the given settings
 * @type {Function}
 */
var RestHapiServer = module.exports = function RestHapiServer(options, readyCallback) {

  // Server init
  var http = new Hapi.Server(
    options.app.host,
    options.app.port,
    options.hapi || {}
  );

  // Database connection
  options.db = Mongoose.createConnection(
    'mongodb://' + options.db.host +
    ':' + options.db.port + '/' + options.db.name
  );
  http.db = options.db;

  // Walk directories to find
  // controllers & models
  var router = new Router(options)
  router.findModels(
    function () {
      router.findControllers(
        function () {
          // Adding resultant routes
          http.addRoutes(
            router.getRoutes()
          );
          // Callback for server start
          if (typeof readyCallback === 'function') {
            readyCallback();
          }
        }
      );
    }
  );
  return http;
};