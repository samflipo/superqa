var Account = require('../models/account.js');
var Student = require('../models/student.js');
var Payment = require('../models/payment.js');
var Report = require('../models/report.js');
var Feed = require('../models/feed.js');
var moment = require('moment');

exports.index = function(req, res){
  Account.findAll(function(accounts){
    Feed.findAll(function(feeds) {
      res.render("accounts/index", {title: 'All Accounts', moment: moment, accounts: accounts, feeds: feeds});
    });
  });
};

exports.show = function(req, res){
  Account.findById(req.params.id, function(account){
    Student.findByAccountId(account._id.toString(), function(students){
      res.render('accounts/show', {title: 'Account profile', class: "active", students: students, account: account, moment:moment});
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
    account.insert(function(account){
      var opt = {
        path: "/accounts/" + account[0]._id.toString(),
        user: account[0].cohort,
        message: "account is created",
        detail: "from " + moment(account[0].startDate).format("MMMM Do YYYY") + " to " + moment(account[0].endDate).format("MMMM Do YYYY")
      }

      var feed = new Feed(opt);

      feed.insert(function(feed){
        res.redirect("/accounts");
      });
    });
  } else {
    Account.findById(req.body._id, function (oldAccount) {
      account.update(req.body._id, function(count){
        if (count) {
          Account.findById(req.body._id, function (account) {
            var opt = {
              path: "/accounts/" + account._id.toString(),
              user: oldAccount.cohort,
              message: "account is updated",
              detail: "to " + account.cohort + ", from " + moment(account.startDate).format("MMMM Do YYYY") + " to " + moment(account.endDate).format("MMMM Do YYYY")
            }

            var feed = new Feed(opt);

            feed.insert(function(feed){
              res.redirect("/accounts");
            });
          })
        }
      });
    });
  }
};

exports.destroy = function(req, res){
  Account.removeById(req.params.id, function(count, account){
    if(count){
      var opt = {
        path: "#",
        user: account.cohort,
        message: "account is deleted",
        detail: "originaly from " + moment(account.startDate).format("MMMM Do YYYY") + " to " + moment(account.endDate).format("MMMM Do YYYY")
      }

      var feed = new Feed(opt);

      feed.insert(function (feed){
        res.send({count: count});
      });
    }else{
      res.send({count: 0});
    }
  });
}
