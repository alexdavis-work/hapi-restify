var Mongoose = require('mongoose');

module.exports = function (data) {
  return {

    lolcatOne: {
      _id : new Mongoose.Schema.Types.ObjectId(),
      title: 'All for me ?',
      picture: 'http://www.lolcats.com/images/u/12/52/allforme.jpg',
      views: 100
    },

    lolcatTwo: {
      _id : new Mongoose.Schema.Types.ObjectId(),
      title: 'I toldz you !',
      picture: 'http://www.lolcats.com/featured/27045-next-time-u-wash-iz-dry.html',
      views: 314
    },

    lolcatThree: {
      _id : new Mongoose.Schema.Types.ObjectId(),
      title: 'Next time u wash iz dry',
      picture: 'http://www.lolcats.com/images/u/08/52/lolcatsdotcom4t7m1sfb7dm4p7nt.jpg',
      views: 12
    },

    lolcatFour: {
      _id : new Mongoose.Schema.Types.ObjectId(),
      title: 'Invisible bike',
      picture: 'http://www.lolcats.com/images/u/07/23/lolcatsdotcomqxw9hbytlkc4rhkc.jpg',
      views: 599
    }
  }
};
