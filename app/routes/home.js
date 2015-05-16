var User = require('../models/user.js');

exports.index = function(req, res){
  User.findById(req.session.userId, function(user){
    if(user){
      res.redirect('/accounts');
    }
  });
}
