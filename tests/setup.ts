// Starts the server
import '../src/app';
import { eventEmitter } from '../src/utility';

before(done => {
  eventEmitter.on('APP_STARTED', () => {
    done();
  });
});