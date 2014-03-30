Hapi-Restify
=================

REST API with HAPI 2.1.x. Built from your Mongo models `version 0.1.0`

## For Hapi 1.x
Version 0.0.3 of hapi-restify works with Hapi 1.x. Because of breaking changes introduced in Hapi 2.x, Hapi-restify version 0.1.0 and upward were fixed to work with Hapi 2.x.

## Installation
```bash
npm install hapi-restify
```

## Use
```js
var Restify = require('hapi-restify'),
    settings = require('./settings/settings');

var myApp = Restify.createApplication(
  settings,
  function () {
    myApp.start(); // Server is now listening at http://localhost:33000/
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
     name: 'mydatabase',
     host: 'localhost',
     port: 27017
   },

   // Display options
   display: {
     // Default limit
     itemsPerPage: 9,
     maxItemsPerPage: 30 // ?limit=x&page=y
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