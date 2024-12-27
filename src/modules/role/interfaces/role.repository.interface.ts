import { BaseRepositoryInterface } from '@database/repositories/base/base.interface.repository';
import { Role } from '@modules/role/entities/role.schema';
import { FilterQuery } from 'mongoose';

export interface RoleRepositoryInterface extends BaseRepositoryInterface<Role> {
  findAllRoleAndNoUserForEachRole(): Promise<Array<Partial<Role>>>;

  getRoleAndPermissions(filter: FilterQuery<Role>): Promise<any>;

  getRoleAndUsersAssigned(filter: FilterQuery<Role>): Promise<any>;
}
