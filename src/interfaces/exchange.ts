import { TradeType } from '../enums';
import { IAuditInfo } from './audit-info';

export interface IExchange {
  _id?: string;
  name: string;
  tradeTypes: TradeType[];
  auditInfo?: IAuditInfo;
}