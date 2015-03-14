var dbname = process.env.DBNAME || 'superqa';
var port = process.env.PORT || 3000;

var express = require('express');
var session = require('express-session');
var app = express();
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var home = require('./routes/home.js');
var initRoutes = require('./lib/init-routes.js');
var initMongo = require('./lib/init-mongo.js');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var lookupUser = require('./lib/lookup-user');
var bounceUser = require('./lib/bounce-user');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


/* --- pipeline begins   */
app.use(initRoutes);
app.use(logger(':remote-addr -> :method :url [:status]'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(cookieParser());
app.use(session({
  store: new RedisStore({host: 'localhost', port: 6379}),
  secret: 'change-this-to-a-super-secret-message',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(lookupUser);
app.use(bounceUser);
/* --- pipeline ends   */




var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening. Port: ' + port + ', Database: ' + dbname);
});

module.exports = app;
