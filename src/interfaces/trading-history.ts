import { IAuditInfo } from './audit-info';

export interface ITradingHistory {
  _id?: string;
  trader: string;
  client: string;
  auditInfo?: IAuditInfo;
}