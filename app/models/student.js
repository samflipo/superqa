var initMongo = require('../lib/init-mongo.js');
var students = initMongo.db.collection('students');
var ObjectID = require('mongoskin').ObjectID;
var moment = require('moment');


module.exports = Student;

function Student(opt){
  this.accountId = opt.accountId;
  this.firstName = opt.firstName;
  this.lastName = opt.lastName;
  this.phone = opt.phone;
  this.email = opt.email;
  this.street = opt.street;
  this.city = opt.city;
  this.state = opt.state;
  this.zip = opt.zip;
  this.updatedAt = moment().format();
}

Student.prototype.insert = function(fn){
  students.insert(this, function(err, record){
    fn(record);
  });
};

Student.prototype.update = function(fn){
  students.update({ _id:this._id}, this, function (err, count){
    fn(count);
  });
};

Student.findByAccountId = function(id, fn){
  students.find({accountId: id}).toArray(function(err, records){
    fn(records);
  });
};

Student.findAll = function(fn){
  students.find().sort({ created : -1 }).toArray(function(err, records){
    fn(records);
  });
};

Student.findById = function(id, fn){
  students.findOne({_id: new ObjectID(id)}, function(err, record){
    fn(record);
  });
};
