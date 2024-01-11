import { createLogger } from 'bunyan';

import { getContext } from './context';

const env = process.env.NODE_ENV;
const createBunyanLogger = (loggerName: string, skipContext?: boolean): ILogObject => {
  const logLevelObj = {
    testing: 'warn',
    production: 'info'
  };

  const bunyanConfig = {
    name: loggerName,
    level: env && logLevelObj[env] ? logLevelObj[env] : 'trace'
  };

  const logger = createLogger(bunyanConfig);

  const constructLogObj = (level: string): InnerConstructLogFunction => {
    return (...args) => {
      // const context = getContext();
      if (skipContext) {
        logger[level](...args);
      } else {
        logger[level]({ ...args, requestId: getContext().id });
      }
    };
  };

  const logObj = {
    info: constructLogObj('info'),
    trace: constructLogObj('trace'),
    debug: constructLogObj('debug'),
    warn: constructLogObj('warn'),
    error: constructLogObj('error'),
    fatal: constructLogObj('fatal')
  };

  return logObj;
};

export { createBunyanLogger };

interface ILogObject {
  info: InnerConstructLogFunction;
  trace: InnerConstructLogFunction;
  debug: InnerConstructLogFunction;
  warn: InnerConstructLogFunction;
  error: InnerConstructLogFunction;
  fatal: InnerConstructLogFunction;
}

type InnerConstructLogFunction = (...args) => void;
