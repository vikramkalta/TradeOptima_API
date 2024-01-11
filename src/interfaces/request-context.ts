export interface IRequestContext {
  [key: string]: IChildRequestContext;
}

export interface IChildRequestContext {
  id: string;
}