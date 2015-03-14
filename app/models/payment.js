var initMongo = require('../lib/init-mongo.js');
var payments = initMongo.db.collection('payments');
var ObjectID = require('mongoskin').ObjectID;
var moment = require('moment');
var _ = require('lodash');


module.exports = Payment;

function Payment(opt){
  this.studentId = opt.studentId;
  this.amount = opt.amount * 1;
  this.balance = 2500 - opt.amount * 1;
  this.type = opt.type;
  this.updatedAt = moment().format();
}

Payment.prototype.insert = function(fn){
  payments.insert(this, function(err, record){
    fn(record);
  });
};

Payment.prototype.update = function(fn){
  payments.update({ _id:this._id}, this, function (err, count){
    fn(count);
  });
};

Payment.findAll = function(fn){
  payments.find().sort({ created : -1 }).toArray(function(err, records){
    fn(records);
  });
};

Payment.findById = function(id, fn){
  payments.findOne({_id: new ObjectID(id)}, function(err, record){
    fn(record);
  });
};

Payment.findByStudentId = function(id, fn){
  payments.find({studentId: id}).toArray(function(err, records){
    var balance = checkBalance(records);
    fn(records, balance);
  });
};

function checkBalance(obj){
  var sum = _.map(obj, "amount");
  var result = 0;
  for (var i = 0; i < sum.length; i++){
    result = result + sum[i];
  }
  result = 2500 - result;
  return result;
}
