import { InvestorTypes } from '../enums';
import { IAuditInfo } from './audit-info';
import { IClient, IDocument } from './client';

export interface IInvestor extends IClient {
  _id?: string;
  reputation?: number;
  clients?: string[];
  documents?: IDocument[];
  investorType: InvestorTypes;
  companyName?: string;
  auditInfo?: IAuditInfo;
}