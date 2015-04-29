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
  this.balance = opt.balance || 0;
}

Student.prototype.insert = function(fn){
  var self = this;

  students.findOne({ email: self.email }, function(err, record){
    if (!record){
      students.insert(self, function(err, record){
        fn(record);
      });
    }else{
      fn(new Error("Student is already in record"));
    }
  });
};

Student.prototype.update = function(id, fn){
  students.update({ _id: new ObjectID(id) }, this, function (err, count){
    if (count){
      fn(count);
    } else {
      fn(err)
    }
  });

};

Student.findByAccountId = function(id, fn){
  students.find({accountId: id}).toArray(function(err, records){
    if(records.length){
      fn(records);
    } else {
      fn(new Error('No student records were found'))
    }
  });
};

Student.findAll = function(fn){
  students.find().sort({ created : -1 }).toArray(function(err, records){
    if(records.length){
      fn(records);
    }else{
      fn(new Error('No student records were found'));
    }
  });
};

Student.findById = function(id, fn){
  students.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(new Error('Student record was not found'));
    }
  });
};

Student.removeById = function(id, fn){
  var self = this;

  students.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      students.remove({_id: new ObjectID(id)}, function(err, count){
        fn(count);
      });
    }else{
      fn(new Error("Student not found"))
    }
  });
};
