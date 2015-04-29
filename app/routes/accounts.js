var Account = require('../models/account.js');
var Student = require('../models/student.js');
var Payment = require('../models/payment.js');
var Report = require('../models/report.js');
var moment = require('moment');

exports.index = function(req, res){
  Account.findAll(function(accounts){
    res.render("accounts/index", {title: 'All Accounts', moment: moment, accounts: accounts});
  });
};

exports.show = function(req, res){
  Account.findById(req.params.id, function(account){
    Student.findByAccountId(account._id.toString(), function(students){
      res.render('accounts/show', {title: 'Account profile', students: students, account: account, moment:moment});
    });
  });
};

exports.send = function(req, res){
  Account.findById(req.params.id, function(account){
    account["startDate"] = moment(account["startDate"]).format("YYYY-MM-DD");
    account["endDate"] = moment(account["endDate"]).format("YYYY-MM-DD");
    res.send({ data: account });
  });
};

exports.create = function(req, res){
  req.body.userId = req.session.userId;

  var account = new Account(req.body);

  if(!req.body._id){
    account.insert(function(count){
      res.redirect("/accounts");
    });
  } else {
    account.update(req.body._id, function(count){
      res.redirect("/accounts");
    });
  }
};

exports.destroy = function(req, res){
  Account.findById(req.params.id, function(account){
    Account.removeById(req.params.id, function(count){
      if(count){
        res.redirect("/accounts", {notice: "Account Removed successfully"});
      }else{
        res.redirect("/accounts", {notice: "Account was not found"});
      }
    });
  });
}
