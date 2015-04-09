process.env.DBNAME = 'superqa-test';
var expect = require('chai').expect;
var User, Account, Student, Payment, u1, a1, s1, initMongo;

describe('Student', function(){

  before(function(done){
    User = require('../../app/models/user');
    Account = require('../../app/models/account');
    Student = require('../../app/models/student');
    Payment = require('../../app/models/payment');
    done();
  });

  beforeEach(function(done){
    initMongo = require('../../app/lib/init-mongo.js');
    u1 = new User({emai:'sami@nomail.com', password:'1234', confirmPassword:'1234'});
      u1.register('1234', function(){
        a1 = new Account({userId: u1._id.toString(),
        startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)',
        endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
        a1.insert(function(){
          s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
          lastName: 'Tes', phone: '1234567890', email: 'sam@test.com',
          street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
          s1.insert(function(){
            done();
        });
      });
    });
  });

  afterEach(function(done){
    initMongo.db.collection('users').drop();
    initMongo.db.collection('accounts').drop();
    initMongo.db.collection('students').drop();
    initMongo.db.collection('payments').drop();
    done();
  });

  describe('new', function(){
    it('should create a new Payment object', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      expect(p1.studentId).to.equal(s1._id.toString());
      expect(p1.amount).to.equal(500);
      expect(p1.balance).to.equal(2000);
      expect(p1.type).to.equal('cash');
      done();
    });
  });

  describe('insert', function(){
    it('should insert payment', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      p1.insert(function(payment){
        expect(payment[0]._id.toString()).to.have.length(24);
        expect(payment[0].studentId).to.equal(s1._id.toString());
        expect(payment[0].amount).to.equal(500);
        expect(payment[0].balance).to.equal(2000);
        done();
      });
    });
  });

  describe('update', function(){
    it('should update payment', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      p1.insert(function(payment){
        var paymentId = payment[0]._id.toString();
        payment[0].amount = "1000";

        var uP = new Payment(payment[0]);

        uP.update(paymentId, function(count){
          Payment.findById(paymentId, function(updatedPayment){
            expect(updatedPayment._id.toString()).to.equal(paymentId);
            expect(updatedPayment.amount).to.equal(1000);
            expect(updatedPayment.balance).to.equal(1500);
            done();
          });
        });
      });
    });
  });

  describe('findAll', function(){
    it('should find all payments', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      var p2 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      var p3 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      p1.insert(function(){
        p2.insert(function(){
          p3.insert(function(){
            Payment.findAll(function(records){
              expect(records).to.have.length(3);
              done();
            });
          });
        });
      });
    });

    it('should not find all payments', function(done){
      Payment.findAll(function(err){
        console.log(err)
        expect(err.message).to.equal('No records were found');
        done();
      });
    });
  });


  describe('.findById', function(){
    it('should find payment by id', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      p1.insert(function(payment){
        Payment.findById(payment[0]._id.toString(), function(payment){
          expect(payment.studentId).to.equal(s1._id.toString());
          expect(payment.amount).to.equal(500);
          expect(payment.balance).to.equal(2000);
          expect(payment.type).to.equal('cash');
          done();
        });
      });
    });

    it('should not find payment by id', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      p1.insert(function(payment){
        Payment.findById(s1._id.toString(), function(err){
          expect(err.message).to.equal('Payment record was not found');
          done();
        });
      });
    });
  });

  describe('.findByStudentId', function(){
    it('should find all payments by studentId', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      var p2 = new Payment({studentId: s1._id.toString(), amount: '800', type: 'cash'});
      var p3 = new Payment({studentId: a1._id.toString(), amount: '1000', type: 'cash'});
      p1.insert(function(){
        p2.insert(function(){
          p3.insert(function(){
            Payment.findByStudentId(s1._id.toString(), function(payments, balance){
              expect(payments).to.have.length(2);
              expect(balance).to.equal(1200);
              done();
            });
          });
        });
      });
    });

    it('should find all payments by studentId', function(done){
      Payment.findByStudentId(s1._id.toString(), function(err){
        expect(err.message).to.equal('Payment records were not found');
        done();
      });
    });
  });

  describe('removeById', function(){
    it('should remove payment', function(done){
      var p1 = new Payment({studentId: s1._id.toString(), amount: '500', type: 'cash'});
      var p2 = new Payment({studentId: s1._id.toString(), amount: '1500', type: 'cash'});
      p1.insert(function(){
        p2.insert(function(){
          Payment.removeById(p1._id.toString(), function(count){
            Payment.findAll(function(records){
              expect(records).to.have.length(1);
              done();
            });
          });
        });
      });
    });

    it('should not remove payment', function(done){
      Payment.removeById(s1._id.toString(), function(err){
        expect(err.message).to.equal('Record was not found');
        done();
      });
    });
  });
});
