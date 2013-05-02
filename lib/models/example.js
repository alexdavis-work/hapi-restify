/**
 * This is an example model file
 * to put under "{settings.models.path folder}/lolcat.js"
 *
 * Created routes :
 *     GET ://host:port/lolcat
 *     GET ://host:port/lolcat/:id
 *     POST ://host:port/lolcat
 *     PATCH ://host:port/lolcat/:id
 *     DELETE ://host:port/lolcat/:id
 * @param mongoose
 * @return {*} Mongoose model
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  mongoose.model('lolcat', new Schema({

    _id: { type: 'ObjectId', required: true },
    name: { type: 'String', required: true, trim: true },
    description: { type: 'String', trim: true }

  }, { collection: 'lolcatz' }));

  return mongoose.model('lolcat');
};
