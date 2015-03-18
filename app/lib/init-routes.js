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

  app.get('/', d, home.index);

  app.get('/register', d, users.fresh);
  app.post('/register', d, users.create);

  app.get('/login', d, users.auth);
  app.post('/login', d, users.login);

  app.get('/logout', d, users.logout);
  app.get('/users/show', d, users.show);

  app.get('/accounts', d, accounts.index);
  app.get('/accounts/:id', d, accounts.show);
  app.post('/accounts', d, accounts.create);

  app.get('/students/:id', d, students.show);
  app.get('/student/:id', d, students.send);
  app.delete('/students/:id', d, students.destroy);
  app.post('/accounts/:id/students', d, students.create);

  app.post('/payments/:id', d, payments.create);
  app.put('/payments/:id', d, payments.update);

  console.log('Routes loaded');
  fn();
}
