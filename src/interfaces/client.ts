import { IAddress } from './address';
import { IAuditInfo } from './audit-info';
import { IExchangeDetails } from './exchange-details';

// To be shared across all user types
export interface IClient {
  _id?: string;
  exchangeDetails: IExchangeDetails[];
  documents?: IDocument[];
  taxId?: string;
  addresses?: IAddress[];
  auditInfo?: IAuditInfo;
}

export interface IDocument {
  _id?: string;
  documentId: string;
  name: string;
}
