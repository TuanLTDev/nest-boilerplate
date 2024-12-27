import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@database/repositories/base/base.abstract.repository';
import { Permission, PermissionDocument } from '@modules/permission/entities/permission.schema';
import { PermissionRepositoryInterface } from '@modules/permission/interfaces/permission.repository.interface';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PermissionRepository
  extends BaseRepositoryAbstract<PermissionDocument>
  implements PermissionRepositoryInterface
{
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {
    super(permissionModel);
  }

  async getAllPermission(filter: FilterQuery<Permission>) {
    const permissions = await this.permissionModel.aggregate([
      {
        $match: filter,
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
    ]);

    return permissions;
  }
}
