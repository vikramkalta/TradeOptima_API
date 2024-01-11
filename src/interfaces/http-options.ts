import { IncomingHttpHeaders } from 'http';

export interface IHttpOptions {
  headers: IncomingHttpHeaders;
  hostname?: string;
  path?: string;
  method: string;
  port?: number;
}

// export interface IHeaders {
//  authorization: string;
// }