import { JwtPayload } from 'jsonwebtoken';

export interface IToken {
  signatureIsValid?: boolean;
  payload?: JwtPayload;
  message?: string;
  success?: boolean;
}