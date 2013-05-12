Example application
=================

This sample is a single model Rest API, reachable at `http://localhost:33000`.

## API Routes

+ GET `/lolcat` : List all lolcatz
+ GET `/lolcat/:id` : Get a specific lolcat
+ POST `/lolcat` : Save a new lolcat
+ PATCH `/lolcat/:id` : Update an existing lolcat
+ DELETE `/lolcat/:id` : Delete an existing lolcat
+ __Custom__ GET `/lolcat/top` : List the most viewed lolcatz

## Model
The `lolcat.js` mongoose model used is located under `models` :
```
module.exports = function (Mongoose) {
  var Schema = Mongoose.Schema;
  Mongoose.model('lolcat', new Schema({
    title: { type: 'String', required: true },
    picture: { type: 'String', required: true },
    views: { type: 'Number', required: true, default :0 }
  }, { collection: 'lolcatz' }));
  return Mongoose.model('lolcat');
};
```

## Controller
The `lolcat.js` controller has only been created to implement the `/lolcat/top` method.
Other request methods are inherited from the base class `Restify.Controller`

## Use
```
cd /path/to/hapi-restify/example
npm install
node server.js
```