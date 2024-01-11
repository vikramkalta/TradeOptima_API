import { IHttpOptions } from '../interfaces';

const GET_HTTP_OPTIONS = (): IHttpOptions => {
  return {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'GET',
    port: 443
  };
};
export { GET_HTTP_OPTIONS };