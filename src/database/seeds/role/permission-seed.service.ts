import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '@modules/role/entities/role.schema';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from '@modules/permission/entities/permission.schema';
import { createPermissions, prepareConditionFindPermissions } from '@modules/permission/helpers';
import { PermissionConfiguration } from '@core/constants/permission.constant';

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async run() {
    const count = await this.permissionModel.countDocuments();

    if (count === 0) {
      const permissionsDto = createPermissions(PermissionConfiguration[0].permissions);
      await this.seedPermissions(permissionsDto);

      await this.seedPermissionsForRole();
    }
  }

  async seedPermissions(items: Partial<Permission>[]) {
    const operations = items.map((item: Partial<Permission>) => {
      return {
        updateOne: {
          filter: { action: item.action, resource: item.resource },
          update: { $set: item },
          upsert: true,
        },
      };
    });

    await this.permissionModel.bulkWrite(operations).then(() => {
      console.log('Seeded data for permission collection: ', items.length, ' record');
    });
  }

  async seedPermissionsForRole() {
    const operations = await Promise.all(
      PermissionConfiguration.map(async (role) => {
        const items = createPermissions(role.permissions);
        const condition = prepareConditionFindPermissions(items);

        const permission_ids = (await this.permissionModel.find(condition).lean().exec()).map(
          (permission) => permission._id,
        );

        return {
          updateOne: {
            filter: { name: role.name },
            update: {
              $set: { description: role.description },
              $addToSet: { permissions: permission_ids },
            },
            upsert: true,
          },
        };
      }),
    );

    await this.roleModel.bulkWrite(operations).then(() => {
      console.log('Update data for role collection: ', operations.length, ' record');
    });
  }
}
