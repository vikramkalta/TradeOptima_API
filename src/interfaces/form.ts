import { IAuditInfo } from './audit-info';

export interface IForm {
  _id?: string;
  entry_ticket_id: string;
  competition_id: string;
  // form: IQuestion[];
  // responses: IResponses[];
  auditInfo?: IAuditInfo;
}