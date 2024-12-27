import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from '@database/seeds/user/user-seed.service';
import { RoleSeedService } from '@database/seeds/role/role-seed.service';
import { UpdateRoleFieldSeedService } from '@database/seeds/user/update-role-field-seed.service';
import { PermissionSeedService } from '@database/seeds/role/permission-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(RoleSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(UpdateRoleFieldSeedService).run();
  await app.get(PermissionSeedService).run();

  await app.close();
};

void runSeed();
