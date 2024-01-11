import fs from 'fs';
import path from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { createBunyanLogger } from '../loaders/logger';
import { IToken } from '../interfaces';

const log = createBunyanLogger('JWT');

const encrypt = (payload): string => {
  try {
    // // The private key without line breakups
    const privKeyPath = path.resolve('id_rsa_priv.pem');
    const PRIV_KEY = fs.readFileSync(privKeyPath, 'utf8');
    const signedJwt = jwt.sign(payload, PRIV_KEY, { algorithm: 'RS256' });
    return signedJwt;
  } catch (error) {
    log.error('Error while encrypting token', error);
    throw error;
  }
};

const decrypt = async (token): Promise<IToken> => {
  try {
    token = token.trim();

    const pubKeyPath = path.resolve('id_rsa_pub.pem');
    const PUB_KEY = fs.readFileSync(pubKeyPath, 'utf8');
    return new Promise((resolve, reject) => {
      jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {
        if (err?.name === 'TokenExpiredError') {
          log.error('err.name expired', err);
          return reject({
            signatureIsValid: false,
            message: 'Token expired'
          });
        }
        if (err?.name === 'JsonWebTokenError') {
          log.error('json web token error', err);
          return reject({
            signatureIsValid: false,
            message: 'Token error'
          });
        }
        if (!err) {
          log.info('payload token', payload);
          return resolve({ signatureIsValid: true, payload: payload as JwtPayload });
        }
        return reject({
          signatureIsValid: false,
          message: 'Token not valid.'
        });
      });
    });
  } catch (error) {
    log.error('Error while parsing token', error);
    throw { signatureIsValid: false, message: 'Invalid token.' };
  }
};
export {
  encrypt,
  decrypt
};