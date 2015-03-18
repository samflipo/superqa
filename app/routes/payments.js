var Payment = require('../models/payment.js');
var moment = require('moment');

exports.create = function(req, res){
  req.body.studentId = req.params.id;

  var payment = new Payment(req.body);

  payment.insert(function(count){
    res.redirect("/students/" + req.params.id);
  });
};

exports.update = function(req, res){
  console.log(req.body);
}
