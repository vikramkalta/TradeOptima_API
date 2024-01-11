import { IClient } from './client';

export interface ICompetitor extends IClient {
  score?: number;
}