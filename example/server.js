var Restify = require('hapi-restify')
,   settings = require('./settings/settings');

// Creates an Hapi.Server instance
var http = Restify.createServer(
  settings,
  function () {

    // Loading fixtures
    var fixtures = require('./fixtures/main')(http.db);
    console.log('Fixtures loaded.');

    // Start the server
    http.start();

    // Log it
    console.log(
      'LolcatzAPI server is listening on ' +
        settings.app.host + ':' + settings.app.port
    );
  }
);