var Account = require('../models/account.js');
var Student = require('../models/student.js');
var Payment = require('../models/payment.js');
var Report = require('../models/report.js');
var moment = require('moment');

exports.index = function(req, res){
  Report.findAll(function(reports){
    res.render("reports/index", {title: 'Account reports', moment: moment, reports: reports});
  });
};

exports.generate = function(req, res){
  var count;
  Report.removeAll(function(reports){
    Account.findById(req.params.id, function(account){
      Student.findByAccountId(account._id.toString(), function(students){
        count = students.length;
        students.forEach(function(student){
          balancer(student, account, function(){
            count--;

            if (!count) {
              res.redirect("/reports/");
            }
          })
        });
      });
    });
  });
};

function balancer (student, account, fn) {
  Payment.findByStudentId(student._id.toString(), function(payments, balance){
    createReport(account, student, balance, function(report){
      fn(report);
    })
  });
}

function createReport(account, student, balance, fn){
  var obj = {
    account: account,
    studentFullName: student.firstName + " " + student.lastName,
    studentEmail: student.email,
    studentPhone: student.phone,
    balance: balance
  };
  
  var report = new Report(obj);
  report.insert(function(report){
    fn(report);
  });
}
