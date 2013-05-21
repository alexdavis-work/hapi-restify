var path = require('path');
var settings = module.exports = {
  app: {
    host: 'localhost',
    port: 33000,
    db: {
      name: 'lolcatz',
      host: 'localhost',
      port: 27017
    },
    display: {
      // Default limit
      itemsPerPage: 9,
      maxItemsPerPage: 30 // ?limit=x&page=y
    },
    models: {
      path: __dirname + '/../models/'
    },
    controllers: {
      path: __dirname + '/../controllers'
    }
  },
  cors: true
};