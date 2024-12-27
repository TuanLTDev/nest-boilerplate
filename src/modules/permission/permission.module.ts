import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '@modules/permission/entities/permission.schema';
import { PermissionRepository } from '@modules/permission/repositoties/permission.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: 'PermissionRepositoryInterface',
      useClass: PermissionRepository,
    },
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
