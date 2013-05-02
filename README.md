RestHapi
=================

Simple framework to implement a REST Api with HAPI.
version 0.0.1

## Installation
```
npm install resthapi
```

## Utilisation
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