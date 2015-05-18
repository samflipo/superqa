var initMongo = require('../lib/init-mongo.js');
var feeds = initMongo.db.collection('feeds');
var ObjectID = require('mongoskin').ObjectID;
var moment = require('moment');


module.exports = Feed;

function Feed(opt){
  this.user = opt.user;
  this.message = opt.message;
  this.detail = opt.detail;
  this.updatedAt = moment().format();
}

Feed.prototype.insert = function(fn){
  feeds.insert(this, function(err, record){
    if (err) {
      fn(err);
    }

    fn(record);
  });
};

Feed.prototype.update = function(id, fn){
  var self = this;

  feeds.findOne({cohort : self.cohort }, function(err, count){
    if (!count){
      feeds.update({ _id: new ObjectID(id)}, self, function (err, count){
        fn(count);
      });
    }else {
      fn(new Error("Cohort name is taken"));
    }
  });
};

Feed.findAll = function(fn){
  feeds.find().sort({ updatedAt : -1 }).toArray(function(err, records){
    if(records.length){
      fn(records);
    }else{
      fn(new Error('No records found'));
    }
  });
};

Feed.findById = function(id, fn){
  feeds.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      fn(record);
    }else{
      fn(new Error('No cohort record was found'));
    }
  });
};

Feed.removeById = function(id, fn){
  feeds.findOne({_id: new ObjectID(id)}, function(err, record){
    if(record){
      feeds.remove({_id: new ObjectID(id)}, function(err, count){
        fn(count);
      });
    }else{
      fn(new Error('Record was not found'));
    }
  });
};
