var _ = require('lodash')
,   BaseController = require('hapi-restify/lib/controller/base');

var LolCatController = module.exports = function LolCatController(options) {
  BaseController.prototype.constructor.call(this, options);
};

_.extend(
  LolCatController.prototype,
  BaseController.prototype
);

_.extend(
  LolCatController.prototype,
  {
    init: function () {
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
