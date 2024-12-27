import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from '@modules/role/entities/role.schema';
import { RoleRepository } from '@modules/role/repositories/role.repository';
import { Permission, PermissionSchema } from '@modules/permission/entities/permission.schema';
import { PermissionModule } from '@modules/permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Role', schema: RoleSchema },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
    PermissionModule,
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
