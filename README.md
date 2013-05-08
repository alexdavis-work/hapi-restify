Hapi-Restify
=================

A REST Api with HAPI. Built from your Mongo models.
version 0.0.1-alpha

## Installation
```
npm install hapi-restify
```

## Usage
```
var Restify = require('hapi-restify'),
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

var http = Restify.createServer(
  settings,
  function () {
    http.start();
  }
);
// Server is now listening on http://localhost:33000/
```