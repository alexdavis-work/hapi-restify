var _ = require('lodash')
  , mongoose = require('mongoose')
  , hapi = require('hapi')
  , Router = require('./lib/router/router');

var RestHapiServer = module.exports = function RestHapiServer(options, readyCallback) {
  var http = new hapi.Server(
    options.app.host,
    options.app.port,
    options.hapi || {}
  );
  options.db = mongoose.createConnection(
    'mongodb://' + options.db.host +
    ':' + options.db.port + '/' + options.db.name
  );
  http.db = options.db;
  // settings.models.path > walk >
  // new router
  var router = new Router(options)
  router.findModels(
    function () {
      http.addRoutes(
        router.getRoutes()
      );
      readyCallback();
    }
  );
  return http;
};