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
  var self = this;
  accounts.findOne({ cohort: self.cohort }, function(err, record){
    if (!record){
      accounts.insert(self, function(err, record){
        fn(record);
      });
    } else {
      fn(new Error("Duplicate Cohort name"));
    }
  });
};

Account.prototype.update = function(id, fn){
  var self = this;

  accounts.findOne({cohort : self.cohort }, function(err, foundAccount){
    if (!foundAccount || (foundAccount._id.toString !== self._id)){
      accounts.update({ _id: new ObjectID(id)}, self, function (err, count){
        if (err) {
          fn(err);
        } else {
          fn(count);
        }
      });
    } else {
      fn(new Error("Cohort name is taken"));
    }
  });
};

Account.findAll = function(fn){
  accounts.find().sort({ created : -1 }).toArray(function(err, records){
    if(records.length){
      fn(records);
    }else{
      fn(new Error('No records found'));
    }
  });
};

Account.findById = function(id, fn){
  accounts.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(new Error('No cohort record was found'));
    }
  });
};

Account.removeById = function(id, fn){
  accounts.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      accounts.remove({_id: new ObjectID(id)}, function(err, count){
        fn(count, record);
      });
    }else{
      fn(new Error('Record was not found'));
    }
  });
};
