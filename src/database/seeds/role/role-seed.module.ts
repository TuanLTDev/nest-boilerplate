import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@modules/role/entities/role.schema';
import { RoleSeedService } from '@database/seeds/role/role-seed.service';
import { Permission, PermissionSchema } from '@modules/permission/entities/permission.schema';
import { PermissionSeedService } from '@database/seeds/role/permission-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
  providers: [RoleSeedService, PermissionSeedService],
  exports: [RoleSeedService, PermissionSeedService],
})
export class RoleSeedModule {}
