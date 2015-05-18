var Payment = require('../models/payment.js');
var Student = require('../models/student.js');
var Account = require('../models/account.js');
var Feed = require('../models/feed.js');
// var stripe = require("stripe")("sk_test_N6aTItvtps3DUIgDckQxgLVe");
var moment = require('moment');

exports.create = function(req, res){
  req.body.studentId = req.params.id;

  var payment = new Payment(req.body);

  if(!req.body._id){
    payment.insert(function(payment){
      Student.findById(payment[0].studentId, function (student) {
        var opt = {
          user: student.firstName + " " + student.lastName,
          message: "made a payment",
          detail: payment[0].type + " payment of $ " + payment[0].amount.toFixed(2)
        }

        var feed = new Feed(opt);

        feed.insert(function (feed) {
          res.redirect("/students/" + req.params.id);
        });
      });
    });
  } else {
    payment.update(req.body._id, function(count){
      res.redirect("/students/" + req.params.id);
    });
  }
};

// exports.stripPay = function(req, res){
//   console.log('It is getting here =>', req.body);
//   var stripeToken = req.body.stripeToken;
//
//   var charge = stripe.charges.create({
//     amount: '2000', // amount in cents, again
//     currency: "usd",
//     source: stripeToken,
//     description: "payinguser@example.com"
//   }, function(err, charge) {
//     if (err && err.type === 'StripeCardError') {
//       res.send('The card has been declined');
//     }
//     res.send(charge);
//   });
// };

exports.show = function(req, res){
  Payment.findById(req.params.id, function(payment){
    Student.findById(payment.studentId, function(student){
      Account.findById(student.accountId, function(account){
        res.render("accounts/students/payments/show", {payment: payment, student: student, account: account, moment: moment});
      });
    });
  });
};

exports.send = function(req, res){
  Payment.findById(req.params.id, function(payment){
    res.send({ data: payment });
  });
};

exports.destroy = function(req, res){
  var studentId = req.params.studentId;

  Payment.removeById(req.params.id, function(count){
    if(count){
      res.send({count: count});
    }
  });
};
