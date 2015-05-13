var initMongo = require('../lib/init-mongo.js');
var expenses = initMongo.db.collection('expenses');
var ObjectID = require('mongoskin').ObjectID;
var moment = require('moment');


module.exports = Expense;

function Expense(opt){
  this.accountId = opt.accountId;
  this.description = opt.description;
  this.note = opt.note;
  this.date = opt.date;
  this.amount = opt.amount;
  this.updatedAt = moment().format();
}

Expense.prototype.insert = function (fn) {
  expenses.insert(this, function(err, record){
    if(err){
      fn(err);
    } else {
      fn(record);
    }
  });
};

Expense.findAll = function(fn) {
  expenses.find().sort({ created : -1 }).toArray(function(err, records){
    if(records.length){
      fn(records);
    }else{
      fn(new Error('No records were found'));
    }
  });
};

Expense.findById = function (fn) {
  expenses.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      fn(record)
    } else {
      fn(new Error('Expense record was not found'))
    }
  });
};

Expense.findByAccountId = function (id, fn) {
  expenses.find({accountId: id}).toArray(function(err, records){
    fn(records);
  });
};
