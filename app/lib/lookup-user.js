module.exports = function(req, res, next){
  var User = require('../models/user.js');

  User.findById(req.session.userId, function(user){
    res.locals.user = user;

    next();
  });
};
