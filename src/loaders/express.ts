import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import asyncHooks from 'async_hooks';
import timeout from 'connect-timeout';

import routes from '../api';
import config from '../config';
import { contexts } from './context';
import { uid } from '../utility';
import { createBunyanLogger } from './logger';
import { IChildRequestContext } from '../interfaces/request-context';

const log = createBunyanLogger('Express');

export default ({ app }: { app: express.Application }): void => {
  /**
   * Health check endpoints
   */
  app.get('/status', (_req, res) => {
    res.status(200).end();
  });
  app.head('/status', (_req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Enable Cross Origin Resource Sharing to all origins by default
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  }
  app.use(cors(corsOptions));

  //create a cors middleware
  app.use((_req, res, next) => {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Some sauce that always add since 2014
  // Lets you use HTTP verbs such as PUT or DELETE in places where client doesnt support it.
  // app.use(require())

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // This should come before routes initializer
  app.use((_req, _res, next) => {
    // We now have a asyncId
    const asyncId = asyncHooks.executionAsyncId();
    // We assign a new empty object as the context of our asyncId
    contexts[asyncId] = ({} as IChildRequestContext);
    contexts[asyncId].id = uid();
    next();
  });

  // Timeout middleware
  app.use(timeout(15000));

  // Response interceptor
  app.use((req, res, next) => {
    const [oldSend] = [res.send];

    (res.send as unknown) = function (data): void {

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (error) {
          return next(error);
        }
      }

      if (!data || data instanceof Error || data?.errors) {
        data = { success: false, msg: 'Something went wrong!', data };
      } else {
        data = { success: true, msg: 'Success', data };
      }
      log.info('API endpoint', req.originalUrl, 'response', data);
      res.send = oldSend;
      res.send(data);
    };
    next();
  });
  // Load API routes
  app.use(config.api.prefix, routes());

  // Catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    const err = new Error('Not found');
    err['status'] = 404;
    next(err);
  });

  // Error handlers
  app.use((err, _req, _res, next) => {
    return next(err);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, _req, res, _next) => {
    // slackBot(_err); // Post error notification on slack
    res.status(err.status || 500);
    if (err.message) {
      res.json({
        errors: {
          message: err.message,
          status: err.status
        }
      });
    } else {
      res.json(err);
    }
  });
}