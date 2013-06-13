var _ = require('lodash')
,   Restify = require('hapi-restify');

var LolCatController = module.exports = function LolCatController() {
  Restify.Controller.prototype.constructor.apply(this, arguments);
};

_.extend(
  LolCatController.prototype,
  Restify.Controller.prototype
);

_.extend(
  LolCatController.prototype,
  {
    init: function () {
      Restify.Controller.prototype.init.call(this);
      this.app.routes.push({
        method: 'GET', path: '/' + this.name + '/top',
        config: { handler: this.getTopLolcats.bind(this) }
      });
    },

    getTopLolcats: function (request) {
      this.model.find({})
        .sort({'views': -1 })
        .exec(function(err, model) {
          request.reply(err || model);
        });
    }
  }
);
