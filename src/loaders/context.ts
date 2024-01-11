import asyncHooks from 'async_hooks';
import { IChildRequestContext, IRequestContext } from '../interfaces';

const contexts: IRequestContext = {};

asyncHooks.createHook({
  init: (asyncId, _type, triggerAsyncId) => {
    // A new resource was created
    // If our parent asyncId already had a context object
    // We assign it to our resource asyncId
    if (contexts[triggerAsyncId]) {
      contexts[asyncId] = contexts[triggerAsyncId];
    }
  },
  destroy: asyncId => {
    // Some cleaning to prevent memory leaks
    delete contexts[asyncId];
  }
}).enable();

function getContext(): IChildRequestContext {
  const asyncId = asyncHooks.executionAsyncId();
  // We try to get the context object linked to our current asyncId
  // If there is none, we return an empty object
  return contexts[asyncId] || ({} as IChildRequestContext);
}

export { contexts, getContext };
