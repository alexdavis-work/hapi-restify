module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  mongoose.model('mymodel', new Schema({

    name: { type: 'String', required: true, trim: true },
    description: { type: 'String', trim: true },

  }, { collection: 'mymodels' }));

  return mongoose.model('mymodel');
};
