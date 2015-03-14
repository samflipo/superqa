var initMongo = require('../lib/init-mongo.js');
var accounts = initMongo.db.collection('accounts');
var ObjectID = require('mongoskin').ObjectID;
var moment = require('moment');


module.exports = Account;

function Account(opt){
  this.userId = opt.userId;
  this.startDate = moment(opt.startDate).format();
  this.endDate = moment(opt.endDate).format();
  this.cohort = opt.cohort;
  this.updatedAt = moment().format();
}

Account.prototype.insert = function(fn){
  accounts.insert(this, function(err, record){
    fn(record);
  });
};

Account.prototype.update = function(fn){
  accounts.update({ _id:this._id}, this, function (err, count){
    fn(count);
  });
};

Account.findAll = function(fn){
  accounts.find().sort({ created : -1 }).toArray(function(err, records){
    fn(records);
  });
};

Account.findById = function(id, fn){
  accounts.findOne({_id: new ObjectID(id)}, function(err, record){
    fn(record);
  });
};
