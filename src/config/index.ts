// import dotenv from 'dotenv';

import { createBunyanLogger } from '../loaders/logger';

const log = createBunyanLogger('Config');
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log.info('process.env.NODE_ENV', process.env.NODE_ENV);
// const envFound = dotenv.config();
// if (envFound.error) {
//   // This error should crash whole process
//   throw new Error('Couldn\'t find the .env file');
// }

export default {
  port: 3001,
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  api: {
    prefix: '/api'
  },
  apiConfig: {
    hostname: 'localhost',
    path: '/api',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': null,
    },
  },
}