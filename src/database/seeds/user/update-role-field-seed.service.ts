import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@modules/user/entities/user.schema';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '@modules/role/entities/role.schema';

import { ROLE } from '@core/constants/app.constant';

@Injectable()
export class UpdateRoleFieldSeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async run() {
    const roles: Array<Role> = await this.roleModel.find().lean().exec();
    const roleRecord: Record<string, Role> = {};

    roles.forEach((role) => {
      if (!roleRecord[role.name]) {
        roleRecord[role.name] = role;
      }
    });

    const users = await this.userModel.find().lean().exec();
    console.log(typeof roles[0]);
    if (roles.length > 0 && typeof roles[0] !== 'object') {
      const operations = users.map((user: any) => {
        return {
          updateOne: {
            filter: { email: user.email },
            update: { $set: { role: roleRecord[user.role.name as ROLE]._id } },
            upsert: true,
          },
        };
      });

      await this.userModel.bulkWrite(operations).then(() => {
        console.log('Updated data for users collection: ', users.length, ' record');
      });
    }
  }
}
