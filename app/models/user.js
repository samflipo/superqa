var initMongo = require('../lib/init-mongo.js');
var users = initMongo.db.collection('users');
var RadarClient = require('node-radar');
var ObjectID = require('mongoskin').ObjectID;
var bcrypt = require('bcrypt');

module.exports = User;

function User(opt){
  this.email = opt.email;
  this.password = opt.password;
  this.lastLogin = new Date();
  this.created = new Date();
  this.admin = true;
}

User.prototype.update = function(fn){
  users.update({ _id:this._id}, this, function (err, count){
    fn(count);
  });
};

User.prototype.register = function(confPass, fn){
  var self = this;
  if (self.password === confPass){
    hashPassword(self.password, function(hashedPwd){
      self.password = hashedPwd;
      insert(self, function(record){
        if(record){
          fn(record[0]);
        } else {
          fn();
        }
      });
    });
  } else {
    fn(false);
  }
};

User.findByEmailandPassword = function(email, password, fn){
  users.findOne({ email : email }, function(err, fUser){
    if(fUser){
      bcrypt.compare(password, fUser.password, function(err, result){
        if(result){
          fn(fUser);
        } else {
          fn();
        }
      });
    } else {
      fn();
    }
  });
};

User.findByEmail = function(email, fn){
  users.findOne({ email : email }, function(err, fUser){
    if(fUser){
      fn(fUser);
    } else {
      fn(null);
    }
  });
};

User.findAll = function(fn){
  users.find().sort({ created : -1 }).toArray(function(err, records){
    fn(records);
  });
};

User.findById = function(id, fn){
  users.findOne({_id: new ObjectID(id)}, function(err, record){
    fn(record);
  });
};

function insert(user, fn){
  users.find({email: user.email}, function(err, record){
    if(!record._id){
      users.insert(user, function(err, record){
        fn(record);
      });
    } else {
      fn();
    }
  });
}

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}
