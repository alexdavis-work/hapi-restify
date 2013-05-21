var Restify = require('hapi-restify'),
    settings = require('./settings/settings');

// New Restify.Application
var myApp = Restify.createApplication(
  settings,
  // Restify.Application ready callback
  function () {
    myApp.start(
      // Hapi.Server started callback
      function () {
        console.log(
          'LolcatzAPI server is listening on ' +
           settings.app.host + ':' + settings.app.port
        );
      }
    );
  }
);