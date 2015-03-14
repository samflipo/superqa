var User = require('../models/user.js');

exports.index = function(req, res){
  User.findById(req.session.userId, function(user){
    if(user){
      res.render('home', {title: 'Welcome to SuperQA internal', user : user});
    } else {
      res.render('home', {title: 'Welcome to SuperQA internal', user : null});
    }
  });
}
