var url = require('url');
var _ = require('lodash');

module.exports = function(req, res, next){

  var path = url.parse(req.url).pathname;
  var urls = ['/register', '/login', '/forget', '/finder'];

  if(_.contains(urls, path)){
    next();
  } else {
    if( req.session.userId){
      next();
    } else {
      res.redirect('/login');
    }
  }
};
