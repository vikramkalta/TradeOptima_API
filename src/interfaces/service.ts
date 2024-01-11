import { IClient } from './client';
import { ICompetitor } from './competitor';
import { IInvestor } from './investor';

export interface IService {
  create(data): Promise<IClient|IInvestor|ICompetitor>;
  update(data): Promise<IClient|IInvestor|ICompetitor>;
  delete(data): Promise<boolean>;
  get(data): Promise<IClient|IInvestor|ICompetitor>;
}