export interface IPermission {
  moduleName: string;
  moduleCode: number;
  permissions: Permission;
}

export interface Permission {
  created: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}