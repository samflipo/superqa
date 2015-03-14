var Student = require('../models/student.js');
var Payment = require('../models/payment.js');
var moment = require('moment');

exports.index = function(req, res){
  Account.findAll(function(accounts){
    res.render("accounts/index", {title: 'All Accounts', moment: moment, accounts: accounts});
  });
};

exports.fresh = function(req, res){
  res.render('accounts/fresh', {title: 'Create Account'});
};

exports.show = function(req, res){
  Student.findById(req.params.id, function(student){
    Payment.findByStudentId(student._id.toString(), function(payments, bal){
      res.render('accounts/students/show', {title: 'Student Account', payments: payments, bal: bal, student: student, moment:moment});
    });
  });
};

exports.create = function(req, res){
  req.body.accountId = req.params.id;

  var student = new Student(req.body);

  student.insert(function(count){
    res.redirect("/accounts/"+req.params.id);
  });
};
