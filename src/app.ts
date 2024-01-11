import express from 'express';
import dotenv from 'dotenv';

import loaders from './loaders';
import { eventEmitter } from './utility';

import config from './config';
import { createBunyanLogger } from './loaders/logger';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const log = createBunyanLogger('App');
let app: express.Application;

async function startServer(): Promise<void> {
  app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, () => {
    global.app = app;
    log.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️ 
    ################################################
    `);
    eventEmitter.emit('APP_STARTED');
  });
}

startServer();