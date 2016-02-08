var User = require('../models/user');

// find users that want daily notifications
var mailUsers = function (callback) {
  User.find({notifications: true}).then(function(data) {
    callback(data);
  })
  
};

module.exports = mailUsers;
