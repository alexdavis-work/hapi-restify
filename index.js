/**
 * Dependencies
 */
var _ = require('lodash')
  , Mongoose = require('mongoose')
  , Hapi = require('hapi')
  , Router = require('./src/Router')
  , Controller = require('./src/Controller')
  , IndexController = require('./src/Controller/Index');

/**
 * RestHapiServer
 * Creates the REST Hapi server
 * with the given settings
 * @type {Function}
 */
var Restify = module.exports = {

  createServer: function (options, readyCallback) {
    // Server init
    var http = new Hapi.Server(
      options.app.host,
      options.app.port,
      options.server || {}
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
  },
  Controller: Controller,
  IndexController: IndexController,
  Router: Router
};