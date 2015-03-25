process.env.DBNAME = 'superqa-test';
var expect = require('chai').expect;
var User, Account, u1, initMongo;
var fs = require('fs');
var exec = require('child_process').exec;

describe('Account', function(){

  before(function(done){
    User = require('../../app/models/user');
    Account = require('../../app/models/account');
    done();
  });

  beforeEach(function(done){
    initMongo = require('../../app/lib/init-mongo.js');
    u1 = new User({email:'sami@nomail.com', password:'1234', confirmPassword:'1234'});
    u1.register(function(){
      done();
    });
  });

  afterEach(function(done){
    initMongo.db.collection('users').drop();
    initMongo.db.collection('accounts').drop();
    done();
  });

  describe('new', function(){
    it('should create a new Account object', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});

      expect(a1.userId).to.equal(u1._id.toString());
      expect(a1.startDate).to.equal('2015-01-01T00:00:00-08:00');
      expect(a1.endDate).to.equal('2015-03-01T00:00:00-08:00');
      expect(a1.cohort).to.equal('Cohort 1');
      done();
    });
  });

  describe('insert', function(){
    it('should insert account', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      a1.insert(function(account){
        expect(account[0]._id.toString()).to.have.length(24);
        expect(account[0].userId).to.equal(a1.userId.toString());
        expect(account[0].startDate).to.equal('2015-01-01T00:00:00-08:00');
        expect(account[0].endDate).to.equal('2015-03-01T00:00:00-08:00');
        done();
      });
    });

    it('should not insert account to the database for duplicate cohort', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      var a2 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      a1.insert(function(){
        a2.insert(function(){
          expect(a1._id.toString()).to.have.length(24);
          expect(a2._id).to.not.be.ok;
          done();
        });
      });
    });
  });

  describe('update', function(){
    it('should update account', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      a1.insert(function(account){
        var accountId = account[0]._id.toString();
        account[0].cohort = "Pumpkin";

        var uA = new Account(account[0]);

        uA.update(accountId, function(count){
          Account.findById(accountId, function(updatedAccount){
            expect(updatedAccount._id.toString()).to.equal(accountId);
            done();
          });
        });
      });
    });

    it('should not update duplicate cohort', function(done){
      var a2 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 2"});
      var a3 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 3"});
      a2.insert(function(account2){
        a3.insert(function(account3){
          var accountId = account2[0]._id.toString();
          account2[0].cohort = "Cohort 3";

          var uA = new Account(account2[0]);

          uA.update(accountId, function(err){
            expect(err.message).to.equal("Cohort name is taken");
            done();
          });
        });
      });
    });
  });

  describe('findAll', function(){
    it('should find all accounts', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      var a2 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 2"});
      var a3 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 3"});
      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            Account.findAll(function(records){
              expect(records).to.have.length(3);
              done();
            });
          });
        });
      });
    });

    it('should not find accounts', function(done){
      Account.findAll(function(err){
        expect(err.message).to.equal('No records found');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find account by id', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      a1.insert(function(account){
        Account.findById(a1._id.toString(), function(account){
          expect(account.userId).to.equal(u1._id.toString());
          expect(account.startDate).to.equal('2015-01-01T00:00:00-08:00');
          expect(account.endDate).to.equal('2015-03-01T00:00:00-08:00');
          expect(account.cohort).to.equal('Cohort 1');
          done();
        });
      });
    });
  });

  describe('removeById', function(){
    it('should remove account', function(done){
      var a1 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
      var a2 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 2"});
      var a3 = new Account({userId: u1._id.toString(), startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)', endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 3"});
      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            Account.removeById(a1._id.toString(), function(count){
              Account.findAll(function(records){
                expect(records).to.have.length(2);
                done();
              });
            });
          });
        });
      });
    });

    it('should not remove account', function(done){
      Account.removeById(u1._id.toString(), function(err){
        expect(err.message).to.equal('Record was not found');
        done();
      });
    });
  });
});
