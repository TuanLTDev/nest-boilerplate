import { BaseRepositoryInterface } from '@database/repositories/base/base.interface.repository';
import { Permission } from '@modules/permission/entities/permission.schema';
import { FilterQuery } from 'mongoose';

export interface PermissionRepositoryInterface extends BaseRepositoryInterface<Permission> {
  getAllPermission(filter: FilterQuery<Permission>): Promise<Array<any>>;
}
