var path = require('path');
var settings = {
  app: {
    host: 'localhost',
    port: 33000
  },
  db: {
    name: 'lolcatz',
    host: 'localhost',
    port: 27017
  },
  models: {
    path: __dirname + '/../models/'
  },
  controllers: {
    path: __dirname + '/../controllers'
  }
};

module.exports = settings;