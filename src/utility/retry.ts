import { safePromise } from './safe-promise';

const retry = async (fn, options = {}, retries = 0): Promise<void> => {
  const [error, result] = await safePromise(fn.call());
  if ((error || !result.success) && retries < 3) {
    retries++;
    retry(fn, options, retries);
  }
};

export { retry };