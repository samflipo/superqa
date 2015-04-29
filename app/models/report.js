var initMongo = require('../lib/init-mongo.js');
var reports = initMongo.db.collection('reports');
var ObjectID = require('mongoskin').ObjectID;
var moment = require('moment');


module.exports = Report;

function Report(opt){
  this.accountId = opt.accountId;
  this.studentFullName = opt.studentFullName;
  this.studentEmail = opt.studentEmail;
  this.studentPhone = opt.studentPhone;
  this.balance = opt.balance;
  this.updatedAt = moment().format();
}

Report.prototype.insert = function(fn){
  var self = this;
  reports.insert(self, function(err, record){
    fn(record);
  });
};

Report.removeAll = function(fn){
  reports.drop(function(err, count){
    fn(count);
  });
};

Report.findAll = function(fn){
  reports.find().toArray(function(err, records){
    if(records){
      fn(records);
    }else{
      fn(new Error('No records found'));
    }
  });
};

Report.findById = function(id, fn){
  reports.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(new Error('No record was found'));
    }
  });
};

Report.removeById = function(id, fn){
  reports.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      reports.remove({_id: new ObjectID(id)}, function(err, count){
        fn(count);
      });
    }else{
      fn(new Error('Record was not found'));
    }
  });
};
