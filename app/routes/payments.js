var Payment = require('../models/payment.js');
var moment = require('moment');

exports.create = function(req, res){
  req.body.studentId = req.params.id;

  var payment = new Payment(req.body);

  if(!req.body._id){
    payment.insert(function(count){
      res.redirect("/students/" + req.params.id);
    });
  } else {
    payment.update(req.body._id, function(count){
      res.redirect("/students/" + req.params.id);
    });
  }
};

exports.send = function(req, res){
  Payment.findById(req.params.id, function(payment){
    res.send({ data: payment });
  });
}

exports.destroy = function(req, res){
  var studentId = req.params.studentId;

  Payment.removeById(req.params.id, function(count){
    if(count){
      res.send({count: count});
    }
  });
};
