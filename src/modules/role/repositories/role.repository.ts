import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@database/repositories/base/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Role, RoleDocument } from '@modules/role/entities/role.schema';
import { RoleRepositoryInterface } from '@modules/role/interfaces/role.repository.interface';

@Injectable()
export class RoleRepository extends BaseRepositoryAbstract<RoleDocument> implements RoleRepositoryInterface {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>) {
    super(roleModel);
  }

  async findAllRoleAndNoUserForEachRole(): Promise<Array<Partial<Role>>> {
    const roles = await this.roleModel.aggregate([
      {
        $lookup: {
          from: 'Users',
          localField: '_id',
          foreignField: 'role',
          as: 'users',
        },
      },
      {
        $addFields: {
          no_user_with_role: { $size: '$users' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          no_user_with_role: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ]);

    return roles;
  }

  async getRoleAndPermissions(filter: FilterQuery<Role>) {
    const role = await this.roleModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'Permissions',
          localField: 'permissions',
          foreignField: '_id',
          pipeline: [
            {
              $project: { _id: 1, name: 1, description: 1, action: 1, resource: 1 },
            },
            {
              $group: {
                _id: '$resource',
                actions: { $push: '$$ROOT' },
              },
            },
            {
              $project: {
                resource: '$_id',
                _id: 0,
                actions: 1,
              },
            },
            {
              $sort: { resource: 1 },
            },
          ],
          as: 'permissions',
        },
      },
    ]);

    return role.length > 0 ? role[0] : null;
  }

  async getRoleAndUsersAssigned(filter: FilterQuery<Role>) {
    const role = await this.roleModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'Users',
          localField: '_id',
          foreignField: 'role',
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
                displayName: 1,
                avatar: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: 'users',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          users: 1,
        },
      },
    ]);

    return role;
  }
}
