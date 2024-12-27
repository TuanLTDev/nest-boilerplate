import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '@modules/role/entities/role.schema';
import { Model } from 'mongoose';

import { ROLE } from '@core/constants/app.constant';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async run() {
    const count = await this.roleModel.countDocuments();

    if (count === 0) {
      const roles: Array<Partial<Role>> = Object.values(ROLE).map((role) => {
        return { name: role };
      });

      const operations = roles.map((role: Partial<Role>) => {
        return {
          updateOne: {
            filter: { name: role.name },
            update: { $set: role },
            upsert: true,
          },
        };
      });

      await this.roleModel.bulkWrite(operations).then(() => {
        console.log('Seeded data for role model: ', roles.length, ' record');
      });
    }
  }
}
