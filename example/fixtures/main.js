var Fixtures = require('mongoose-fixtures');

module.exports = function (db) {

  var data = {};

  data.lolcat = require('./lolcat')(data);

  // Adapt data models
  // from objects to array
  var newData = [];
  for (model in data) {
    newData[model] = [];
    for (item in data[model]) {
      newData[model].push(
        data[model][item]
      );
    }
  }
  data = newData;
  delete newData;

  return Fixtures.load(data, db);
};