var Student = require('../models/student.js');
var Payment = require('../models/payment.js');
var Account = require('../models/account.js');
var moment = require('moment');

exports.index = function(req, res){
  Account.findAll(function(accounts){
    Student.findAll(function(students){
      res.render('accounts/students/index', {title: 'All Students', moment: moment, students: students, accounts: accounts});
    });
  });
};

exports.fresh = function(req, res){
  res.render('accounts/fresh', {title: 'Create Account'});
};

exports.show = function(req, res){
  Student.findById(req.params.id, function(student){
    Account.findById(student.accountId, function(account){
      Payment.findByStudentId(student._id.toString(), function(payments, bal){
        res.render('accounts/students/show', {title: 'Student Account', account: account, payments: payments, bal: bal, student: student, moment:moment});
      });
    });
  });
};

exports.send = function(req, res){
  Student.findById(req.params.id, function(student){
    Account.findById(student.accountId, function(account){
      Payment.findByStudentId(student._id.toString(), function(payments, bal){
        res.send({data: student});
      });
    });
  });
};

exports.destroy = function(req, res){
  Student.findById(req.params.id, function(student){
    var accountId = student.accountId;
    Student.removeById(req.params.id, function(count){
      if(count){
        res.redirect("/accounts/"+ accountId.toString(), {notice: "Student Removed successfully"});
      }else{
        res.redirect("/accounts/"+ student.accountId.toString(), {notice: "Student was not found"});
      }
    });
  });
}

exports.create = function(req, res){
  req.body.accountId = req.params.id;

  var student = new Student(req.body);

  if(!req.body._id){
    student.insert(function(count){
      res.redirect("/accounts/"+req.params.id);
    });
  }else{
    student.update(req.body._id, function(count){
      res.redirect("/accounts/"+req.params.id);
    });
  }

};
