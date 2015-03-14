var Account = require('../models/account.js');
var Student = require('../models/student.js');
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

exports.create = function(req, res){
  req.body.userId = req.session.userId;

  var account = new Account(req.body);

  account.insert(function(count){
    res.redirect("/accounts");
  });
};
