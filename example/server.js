var RestifyServer = require('hapi-restify')
,   settings = require('./settings/settings');

// Launch da server
var http = RestifyServer(
  settings,
  function () {
    var fixtures = require('./fixtures/main')(http.db);
    console.log('Fixtures loaded.');

    http.start();
    console.log(
      'LolcatzAPI server is listening on ' +
        settings.app.host + ':' + settings.app.port
    );
  }
);