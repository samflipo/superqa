process.env.DBNAME = 'superqa-test';
var expect = require('chai').expect;
var User, Account, Student, u1, a1, initMongo;
var fs = require('fs');
var exec = require('child_process').exec;

describe('Student', function(){

  before(function(done){
    User = require('../../app/models/user');
    Account = require('../../app/models/account');
    Student = require('../../app/models/student');
    done();
  });

  beforeEach(function(done){
    initMongo = require('../../app/lib/init-mongo.js');
    u1 = new User({emai:'sami@nomail.com', password:'1234', confirmPassword:'1234'});
      u1.register(function(){
        a1 = new Account({userId: u1._id.toString(),
        startDate: 'Thu Jan 01 2015 00:00:00 GMT-0800 (PST)',
        endDate: 'Sun Mar 01 2015 00:00:00 GMT-0800 (PST)', cohort: "Cohort 1"});
        a1.insert(function(){
          done();
      });
    });
  });

  afterEach(function(done){
    initMongo.db.collection('users').drop();
    initMongo.db.collection('accounts').drop();
    initMongo.db.collection('students').drop();
    done();
  });

  describe('new', function(){
    it('should create a new Student object', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});

      expect(s1.accountId).to.equal(a1._id.toString());
      expect(s1.firstName).to.equal('Sam');
      expect(s1.lastName).to.equal('Tes');
      expect(s1.email).to.equal('sam@test.com');
      expect(s1.street).to.equal('100 Test');
      expect(s1.city).to.equal('Oakland');
      expect(s1.state).to.equal('CA');
      expect(s1.zip).to.equal('94610');
      done();
    });
  });

  describe('insert', function(){
    it('should insert student', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        expect(student[0]._id.toString()).to.have.length(24);
        expect(student[0].accountId).to.equal(s1.accountId.toString());
        expect(student[0].firstName).to.equal('Sam');
        expect(student[0].lastName).to.equal('Tes');
        done();
      });
    });

    it('should not insert Student to the database for duplicate email', function(done){
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567891', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});

      var s3 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567891', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});

      s2.insert(function(){
        s3.insert(function(){
          expect(s2._id.toString()).to.have.length(24);
          expect(s3._id).to.not.be.ok;
          done();
        });
      });
    });
  });

  describe('update', function(){
    it('should update student', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        var studentId = student[0]._id.toString();
        student[0].lastName = "Tesfai";

        var uS = new Student(student[0]);

        uS.update(studentId, function(count){
          Student.findById(studentId, function(updatedStudent){
            expect(updatedStudent._id.toString()).to.equal(studentId);
            expect(updatedStudent.lastName).to.equal('Tesfai');
            done();
          });
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find student by id', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        Student.findById(s1._id.toString(), function(student){
          expect(student.accountId).to.equal(a1._id.toString());
          expect(student.phone).to.equal('1234567890');
          expect(student.email).to.equal('sam@test.com');
          done();
        });
      });
    });

    it('should not find student by id', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        Student.findById(a1._id.toString(), function(err){
          expect(err.message).to.equal('Student record was not found');
          done();
        });
      });
    });
  });


  describe('.findByAccountId', function(){
    it('should find all students by AccountId', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'samboy@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s3 = new Student({accountId: '1234567890', firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam2@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        s2.insert(function(student){
          s3.insert(function(student){
            Student.findByAccountId(a1._id.toString(), function(records){
              expect(records).to.have.length(2);
              done();
            });
          });
        });
      });
    });

    it('should not find students by AccountId', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'samboy@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s3 = new Student({accountId: '1234567890', firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam2@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        s2.insert(function(student){
          s3.insert(function(student){
            Student.findByAccountId(s1._id.toString(), function(err){
              expect(err.message).to.equal('No student records were found');
              done();
            });
          });
        });
      });
    });
  });

  describe('findAll', function(){
    it('should find all students', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'samboy@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s3 = new Student({accountId: '1234567890', firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'sam2@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student){
        s2.insert(function(student){
          s3.insert(function(student){
            Student.findAll(function(records){
              expect(records).to.have.length(3);
              done();
            });
          });
        });
      });
    });

    it('should not find all students', function(done){
      Student.findAll(function(err){
        expect(err.message).to.equal('No student records were found');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find student by id', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'samboy@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567891', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s3 = new Student({accountId: '1234567890', firstName: 'Sam',
      lastName: 'Tes', phone: '1234567892', email: 'sam2@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(student1){
        s2.insert(function(student2){
          s3.insert(function(student3){
            Student.findById(student1[0]._id.toString(), function(student){
              expect(student.accountId).to.equal(a1._id.toString());
              expect(student.email).to.equal('samboy@test.com');
              expect(student.city).to.equal('Oakland');
              done();
            });
          });
        });
      });
    });
  });

  describe('removeById', function(){
    it('should remove student', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'samboy@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567891', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s3 = new Student({accountId: '1234567890', firstName: 'Sam',
      lastName: 'Tes', phone: '1234567892', email: 'sam2@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(){
        s2.insert(function(){
          s3.insert(function(){
            Student.removeById(s1._id.toString(), function(count){
              Student.findAll(function(records){
                expect(records).to.have.length(2);
                done();
              });
            });
          });
        });
      });
    });

    it('should not remove student', function(done){
      var s1 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567890', email: 'samboy@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s2 = new Student({accountId: a1._id.toString(), firstName: 'Sam',
      lastName: 'Tes', phone: '1234567891', email: 'sam1@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      var s3 = new Student({accountId: '1234567890', firstName: 'Sam',
      lastName: 'Tes', phone: '1234567892', email: 'sam2@test.com',
      street: '100 Test', city: 'Oakland', state: 'CA', zip: '94610'});
      s1.insert(function(){
        s2.insert(function(){
          s3.insert(function(){
            Student.removeById(u1._id.toString(), function(err){
              expect(err.message).to.equal('Student not found');
              done();
            });
          });
        });
      });
    });
  });
});
