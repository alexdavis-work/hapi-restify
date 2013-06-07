var Fixtures = require('pow-mongoose-fixtures');

module.exports = function (db) {

  var data = {};

  data.lolcat = require('./lolcat')(data);

  // Adapt data models
  // from objects to array
  var newData = [];
  for (var model in data) {
    newData[model] = [];
    for (var item in data[model]) {
      newData[model].push(
        data[model][item]
      );
    }
  }
  data = newData;
  delete newData;

  return Fixtures.load(data, db);
};