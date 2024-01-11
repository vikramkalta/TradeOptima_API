import { IAuditInfo } from './audit-info';
export interface IAppConfig {
  attributeName: string;
  attributeValue: string;
  auditInfo?: IAuditInfo;
}