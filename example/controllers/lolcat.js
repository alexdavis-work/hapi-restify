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
      var self = this;
      this.router.appRoutes.push({
        method: 'GET', path: '/' + this.name + '/top',
        config: { handler: self.getTopLolcats.bind(self) }
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
