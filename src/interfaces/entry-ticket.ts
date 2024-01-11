import { IAuditInfo } from './audit-info';

export interface IEntryTicket {
  _id?: string;
  name: string;
  description: string;
  price: string;
  free_tier: boolean;
  auditInfo?: IAuditInfo;
}