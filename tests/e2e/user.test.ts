import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { eventEmitter, STATUSES, STATUS_CODES } from '../../src/utility';
import { cleanupDb } from '../helpers/cleanup-db';

// Configure chai
chai.use(chaiHttp);
chai.should();

const user = {
  email: 'test@test.com',
  firstName: 'Test',
  lastName: 'Test',
  username: 'test1',
  dob: new Date(1991, 1, 1),
  password: 'test',
};

describe('E2E: User routes test', () => {
  describe('POST /login', () => {
    before(done => {
      require('../../src/app');
      eventEmitter.on('APP_STARTED', () => {
        done();
      });
    });

    it('should create a new user', done => {
      chai.request(global.app)
        .post('/auth/user')
        .send(user)
        .end((_err, res) => {
          res.should.have.status(STATUS_CODES[STATUSES.ok]);
          res.body.should.have.property('success');
          res.body.should.have.property('data');
          expect(res.body.success).equal(true);
          expect(res.body.data).to.have.property('_id');
          done();
        });
    });

    it(`should check fail for existing username - ${user.username}`, done => {
      chai.request(global.app)
        .post('/auth/user/username')
        .send({ username: user.username })
        .end((_err, res) => {
          res.should.have.status(STATUS_CODES[STATUSES.badRequest]);
          res.body.should.have.property('success');
          res.body.should.have.property('data');
          expect(res.body.success).equal(false);
          done();
        });
    });

    // Test login route
    // it('should throw 404 when provided non-existing user', done => {
    //   chai.request(global.app)
    //     .post('/auth/user/login')
    //     .send({ email: 'test1@test.com', password: user.password, })
    //     .end((_err, res) => {
    //       res.should.have.status(404);
    //       res.body.should.be.a('object');
    //       done();
    //     });
    // });

    // it('should throw 401 when provided wrong password', done => {
    //   const requestBody = {
    //     Email: 'test@test.com',
    //     Password: 'test',
    //   };
    //   chai.request(global.app)
    //     .post('/auth/user/login')
    //     .send(requestBody)
    //     .end((_err, res) => {
    //       res.should.have.status(404);
    //       res.body.should.be.a('object');
    //       done();
    //     });
    // });

    // Teardown: Disconnect from the database after running all tests
    after(async () => {
      await cleanupDb();
      process.exit(1);
    });
  });
});