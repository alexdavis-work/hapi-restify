var Restify = require('../'),
    settings = require('./settings/settings');

// New Restify.Application
var myApp = Restify.createApplication(
  settings,
  // Restify.Application ready callback
  function (app) {
    require('./fixtures/main')(app.db);
    console.log('Fixtures loaded.');

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