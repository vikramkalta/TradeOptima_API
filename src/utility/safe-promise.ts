import { IToken } from '../interfaces';

const safePromise = (promise): Promise<[Error, IToken]> => promise.then(res => [null, res]).catch(err => [err]);
export { safePromise };