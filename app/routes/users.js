var User = require('../models/user.js');
var moment = require('moment');

exports.finder = function(req, res){
  res.render('users/find', {title: 'Forget password'});
};

exports.refresh = function(req, res){
  res.render('users/refresh', {title: 'Enter new password'});
};

exports.recreate = function(req, res){
  User.findByEmail(req.body.email, function(user){
    if(user){
      // Tood: generate random code and hold it in session and email it to the found user
      // to verify it's the actual user changing password.
      // require the random token with niew password.
      req.session.regenerate(function(){
        req.session.passwordUserId = user._id.toString();
        req.session.save(function(){
          res.redirect('/finder');
        });
      });
    } else {
      res.render('users/find', {title: 'Forget password', notice: 'email was not found'});
    }
  });
};

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

exports.reauth = function(req, res){
  req.body.userId = req.session.passwordUserId;

  User.findById(req.session.passwordUserId, function(user){
    if(user){
      user.password = req.body.password;

      var nUser = new User(user);
      nUser.admin = user.admin;

      nUser.updatePassword(req.body.confirmPassword, user._id, function(count){
        if(count){
          req.session.regenerate(function(){
            req.session.userId = user._id.toString();
            req.session.save(function(){
              res.redirect('/accounts');
            });
          });
        }else{
          res.render('users/refresh', {title: 'Enter new password', notice: "Passwords don't match"});
        }
      })
    }else{
      res.render('users/refresh', {title: 'Enter new password', notice: "Something went wrong, password is not updated"});
    }
  });
}

exports.create = function(req, res){
  User.findByEmail(req.body.email, function(isUser){
    if(!isUser){
      var user = new User(req.body);

      user.register(req.body.confirmPassword, function(rUser){
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
