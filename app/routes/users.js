var User = require('../models/user.js');
var moment = require('moment');

exports.fresh = function(req, res){
  res.render('users/fresh', {title: 'Register User'});
};

exports.auth = function(req, res){
  res.render('users/login', {title: 'Login User'});
};

exports.show = function(req, res){
  User.findById(req.session.userId, function(user){
    User.findAll(function(users){
      res.render('users/show', {title: 'User Profile', user: user, users:users, moment:moment})
    })
  });
};

exports.create = function(req, res){
  User.findByEmail(req.body.email, function(isUser){
    if(!isUser){
      var user = new User(req.body);

      user.register(function(rUser){
        if(rUser._id){
          req.session.regenerate(function(){
            req.session.userId = rUser._id.toString();
            req.session.save(function(){
              res.redirect('/accounts');
            });
          });
        } else {
          res.render('users/fresh', {notice : 'Registration failed'});
        }
      });
    } else {
      res.render('users/fresh', {title: 'Register User', notice : 'User already exists'});
    }
  });
};


exports.login = function(req, res) {
  User.findByEmailandPassword(req.body.email, req.body.password, function(foundUser){
    if(foundUser){
      req.session.regenerate(function(){
        req.session.userId = foundUser._id.toString();
        req.session.save(function(){
          res.redirect('/accounts');
        });
      });
    }else{
      res.render('users/login', {title: 'Login User', notice: "User not found"});
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.destroy = function(req, res){
  var userId = req.params.id;
  User.deleteById(userId, function(count){
    if(count === 1){
      Item.deleteAllByUserId(userId, function(){
        res.redirect('/');
      });
    }
  });
};
