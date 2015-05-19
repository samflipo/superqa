var fs = require("fs");
var jade = require("jade");

var api_key = "key-848b8ca91691b1fc26890e43dc80b822";
var domain = "sandbox4a3cd20ce0f8417096f73d2765a375d3.mailgun.org";
var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });
var superqa = "sam_w@superqaschool.com";

exports.sendWelcome = function (data, fn) {
  send({
    from: superqa,
    to: data.to,
    name: data.name,
    subject: "Welcome to SuperQA",
    template: "welcome"
  }, fn);
};

exports.sendInvoice = function (data, fn) {
  send({
    from: superqa,
    to: data.to,
    name: data.name,
    amount: data.amount,
    type: data.type,
    date: data.date,
    subject: "Payment Receipt",
    template: "invoice"
  }, fn);
};

function send(data, fn){
  if(data.to.match(/@nomail.com/g)){fn(); return;}

  data.html = compileJade(data);

  delete data.template;
  delete data.name;
  delete data.amount;
  delete data.type;
  delete data.date;

  mailgun.messages().send(data, function (err, body) {
    fn(err, body);
  });
}

function compileJade(data){
  var template = __dirname + "/../views/email/" + data.template + ".jade";
  var original = fs.readFileSync(template, "utf8");
  var partial = jade.compile(original);
  var output = partial(data);

  return output;
}
