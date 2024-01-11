import { IAuditInfo } from './audit-info';

export interface IQuestion {
  _id?: string;
  text: string;
  type: string;
  options: string[];
  defaultValue: unknown;
  auditInfo?: IAuditInfo;
}