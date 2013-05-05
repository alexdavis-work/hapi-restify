var RestifyServer = require('hapi-restify')
,   settings = require('./settings/settings');

// Launch da server
var http = RestifyServer(
  settings,
  function () {
    http.start();
    console.log(
      'Server is f*cking listening on ' +
        settings.app.host + ':' + settings.app.port
    );

    var fixtures = require('./fixtures/main')(http.db);
    console.log('Fixtures loaded.');
  }
);