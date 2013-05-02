RestHapi
=================

Simple framework to implement a REST Api with HAPI.


```
var RestHapiServer = require('resthapi'),
    path = require('path'),
    settings = {
       app: {
         host: 'localhost',
         port: 33000
       },
       db: {
         name: 'databaseName',
         host: 'localhost',
         port: 27017
       },
       models: {
         path: __dirname + '/models/'
       },
       controllers: {
         path: __dirname + '/controllers'
       }
     };

var http = RestHapiServer(
  settings,
  function () {
    http.start();
  }
);

// RestHapi is now listening on http://localhost:33000/
```