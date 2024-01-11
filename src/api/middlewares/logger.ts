import { NextFunction } from 'express';
import { createBunyanLogger } from '../../loaders/logger';

/**
 * Initialises context class for each request
 * @param  {*} req  Express req Object
 * @param  {*} res Express res Object
 * @param  {*} next Express next Function
 */

let loggerContext;

const attachLoggerContext = async (req, _res, next): Promise<NextFunction> => {

  const log = createBunyanLogger('Logger-Middleware');
  // TODO: add req url and other necessary details
  log.info('Req object--->', req.url, req.headers, req.method, req.body);

  return next();
};

export default attachLoggerContext;

export { loggerContext };