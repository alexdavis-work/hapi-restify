/**
 * Hapi.Restify
 */
var Hapi_Restify = module.exports = {
  Application: require('./src/Application'),
  Router: require('./src/Router'),
  Controller: require('./src/Controller'),
  IndexController: require('./src/Controller/Index')
};

Hapi_Restify.createApplication = function (options, readyCallback) {
  return new Hapi_Restify.Application(options, readyCallback);
};