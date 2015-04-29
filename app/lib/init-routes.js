var d = require('../lib/request-debug.js');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  } else {
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');
  var accounts = require('../routes/accounts');
  var students = require('../routes/students');
  var payments = require('../routes/payments');
  var reports = require('../routes/reports');

  app.get('/', d, home.index);

  app.get('/finder', d, users.refresh);
  app.post('/finder', d, users.reauth);

  app.get('/forget', d, users.finder);
  app.post('/forget', d, users.recreate);

  app.get('/register', d, users.fresh);
  app.post('/register', d, users.create);

  app.get('/login', d, users.auth);
  app.post('/login', d, users.login);

  app.get('/logout', d, users.logout);
  app.get('/users/show', d, users.show);

  app.get('/reports', d, reports.index);
  app.post('/reports/:id', d, reports.generate);

  app.get('/account/:id', d, accounts.send);
  app.get('/accounts', d, accounts.index);
  app.get('/accounts/:id', d, accounts.show);
  app.delete('/accounts/:id', d, accounts.destroy);
  app.post('/accounts', d, accounts.create);

  app.get('/payment/:id', d, payments.send);
  app.get('/payments/:id', d, payments.show);
  app.post('/payments/stripe/:id', d, payments.stripPay);
  app.post('/payments/:id', d, payments.create);
  app.delete('/payments/:id/:studentId', d, payments.destroy);

  app.get('/students/:id', d, students.show);
  app.get('/students', d, students.index);
  app.get('/student/:id', d, students.send);
  app.delete('/students/:id', d, students.destroy);
  app.post('/accounts/:id/students', d, students.create);

  console.log('Routes loaded');
  fn();
}
