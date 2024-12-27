import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/user/entities/user.schema';
import { UserSeedService } from '@database/seeds/user/user-seed.service';
import { Role, RoleSchema } from '@modules/role/entities/role.schema';
import { UpdateRoleFieldSeedService } from '@database/seeds/user/update-role-field-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [UserSeedService, UpdateRoleFieldSeedService],
  exports: [UserSeedService, UpdateRoleFieldSeedService],
})
export class UserSeedModule {}
