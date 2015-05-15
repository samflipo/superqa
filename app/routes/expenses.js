var Account = require('../models/account.js');
var Student = require('../models/student.js');
var Payment = require('../models/payment.js');
var Report = require('../models/report.js');
var Expense = require('../models/expense.js');
var moment = require('moment');

exports.show = function (req, res) {
  Account.findById(req.params.id, function (account) {
    Expense.findByAccountId(req.params.id, function (expenses) {
      res.render("accounts/expenses/show", {title: account.cohort, moment: moment, account: account, expenses: expenses});
    });
  });
};

exports.create = function (req, res) {
  var expense = new Expense(req.body);
  expense.insert(function (expense) {
    res.redirect("/expenses/" + expense[0].accountId);
  });
};
