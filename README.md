Hapi-Restify
=================

REST API with HAPI. Built from your Mongo models `version 0.0.2-beta`

## Installation
```bash
npm install hapi-restify
```

## Use
```js
var Restify = require('hapi-restify'),,
    settings = require('./settings/main');

var http = Restify.createServer(
  settings,
  function () {
    http.start(); // Server is now listening at http://localhost:33000/
  }
);

```

## Settings
The settings object given to `Restify.createServer` is the same as the one you would use with `Hapi.createServer` :
_See_ https://github.com/spumko/hapi/blob/master/docs/Reference.md#server-options

Restify custom settings are available in the `app` section of this object :
```js
var path = require('path');
var settings = module.exports = {

  app: {
   host: 'localhost',
   port: 4242,

   // Mongo database settings
   db: {
     name: 'surimmo',
     host: 'localhost',
     port: 27017
   },

   // Models directory
   models: { path: __dirname + '/../models/' },

   // Controllers directory
   controllers: { path: __dirname + '/../controllers' }

   // Custom settings can be added here
 },
 // Extra Hapi settings can be added here
 // cache: {}, auth: {}, ...
}
```