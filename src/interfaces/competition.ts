import { IAuditInfo } from './audit-info';

export interface ICompetition {
  _id?: string;
  entry_ticket_id: string;
  name: string;
  description: string;
  form_data: string;
  auditInfo?: IAuditInfo;
}