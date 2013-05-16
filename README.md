Hapi-Restify
=================

REST API with HAPI. Built from your Mongo models `version 0.0.1`

## Installation
```bash
npm install hapi-restify
```

## Use
```js
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
    http.start(); // Server is now listening at http://localhost:33000/
  }
);

```