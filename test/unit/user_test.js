process.env.DBNAME = 'superqa-test';
var expect = require('chai').expect;
var User, initMongo;

describe('User', function(){

  before(function(done){
    User = require('../../app/models/user');
    done();
  });

  beforeEach(function(done){
    var u1 = new User({email:'sami@nomail.com', password:'1234', confirmPassword:'1234'});
    initMongo = require('../../app/lib/init-mongo.js');
    u1.register("1234", function(){
      done();
    });
  });

  afterEach(function(done){
    initMongo.db.collection('users').drop();
    done();
  });

  describe('new', function(){
    it('should create a new User object', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword:'1234'});

      expect(u1.email).to.equal('sam@nomail.com');
      expect(u1.password).to.equal('1234');
      done();
    });
  });

  describe('register', function(){
    it('should register user', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword:'1234'});
      u1.register("1234", function(){
        expect(u1.email).to.equal('sam@nomail.com');
        expect(u1._id.toString()).to.have.length(24);
        done();
      });
    });

    it('should not register a user to the database for duplicate email', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword:'1234'});
      var u2 = new User({email:'sam@nomail.com', password:'1234', confirmPassword:'1234'});
      u1.register('1234', function(){
        u2.register('1234', function(){
          expect(u1._id.toString()).to.have.length(24);
          expect(u2._id).to.not.be.ok;
          done();
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find a user by id', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword:'1234'});
      u1.register('1234', function(){
        User.findById(u1._id.toString(), function(record){
          expect(u1.email).to.equal('sam@nomail.com');
          expect(record.email).to.equal('sam@nomail.com');
          expect(record._id).to.deep.equal(u1._id);
          done();
        });
      });
    });
  });

  describe('findByEmailandPassword', function(){
    it('should find a user by email and password', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword: '1234'});
      var u2 = new User({email:'bob@nomail.com', password:'1234', confirmPassword: '1234'});
      var u3 = new User({email:'jim@nomail.com', password:'1234', confirmPassword: '1234'});
      u1.register('1234', function(){
        u2.register('1234', function(){
          u3.register('1234', function(){
            User.findByEmailandPassword('sam@nomail.com', '1234', function(sam){
              User.findByEmailandPassword('bob@nomail.com', '1234', function(bob){
                User.findByEmailandPassword('jim@nomail.com', '1234', function(jim){
                  expect(sam._id.toString()).to.have.length(24);
                  expect(bob._id.toString()).to.have.length(24);
                  expect(jim._id.toString()).to.have.length(24);
                  expect(sam.email).to.equal('sam@nomail.com');
                  expect(bob.email).to.equal('bob@nomail.com');
                  expect(jim.email).to.equal('jim@nomail.com');
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('should not find a user by email and password', function(done){
      User.findByEmailandPassword('sam@nomail.com', '0000', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });

    it('should not find a user by email and password', function(done){
      User.findByEmailandPassword('bob@nomail.com', '0000', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });

    it('should not find a user by email and password', function(done){
      User.findByEmailandPassword('jimbo@nomail.com', '1234', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
  });

  describe('findByEmail', function(){
    it('should find a user by email', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword: '1234'});
      u1.register('1234', function(){
        User.findByEmail('sam@nomail.com', function(sam){
          expect(sam._id.toString()).to.have.length(24);
          expect(sam.email).to.equal('sam@nomail.com');
          done();
        });
      });
    });

    it('should not find a user by email', function(done){
      User.findByEmail('samio@nomail.com', function(user){
        expect(user).to.be.null;
        done();
      });
    });
  });

  describe('findAll', function(){
    it('should find all users', function(done){
      var u1 = new User({email:'sam@nomail.com', password:'1234', confirmPassword: '1234'});
      var u2 = new User({email:'bob@nomail.com', password:'1234', confirmPassword: '1234'});
      var u3 = new User({email:'jim@nomail.com', password:'1234', confirmPassword: '1234'});
      u1.register('1234', function(){
        u2.register('1234', function(){
          u3.register('1234', function(){
            User.findAll(function(records){
              expect(records).to.have.length(4);
              done();
            });
          });
        });
      });
    });
  });

  describe('update', function(){
    it('should update user record in the db', function(done){
      var u1 = new User({email:'samjos@nomail.com', password:'1234', confirmPassword:'1234'});
      u1.register('1234', function(){
        User.findByEmail("samjos@nomail.com", function(user){
          var userId = user._id;
          user.email = 'sam@nomail.com';

          var sam = new User(user);

          sam.update(userId.toString(), function(count){
            User.findByEmail('sam@nomail.com', function(user){
              expect(user.email).to.be.equal('sam@nomail.com');
              done();
            });
          });
        });
      });
    });
  });
});
