var fixtures = require('mongoose-fixtures');

module.exports = function (db) {

  var data = {};

  data.lolcat = require('./lolcat')(data);

  // Adapt data models
  // from objects to array
  var newData = [];
  for (model in data) {
    newData[model] = [];
    //var newModel = {};
    //newModel[model] = []
    for (item in data[model]) {
      newData[model].push(
      //newModel[model].push(
        data[model][item]
      );
    }
    //newData.push(newModel);
  }
  data = newData;
  delete newData;

  //Directories (loads all files in the directory)
  return fixtures.load(data, db);
};