import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/user/entities/user.schema';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { RoleModule } from '@modules/role/role.module';
import { Permission, PermissionSchema } from '@modules/permission/entities/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
