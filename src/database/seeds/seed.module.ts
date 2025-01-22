import { Module } from '@nestjs/common';
import { UserSeedModule } from '@database/seeds/user/user-seed.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath } from '@core/helper';
import configuration from '@config/swagger.config';
import { RoleSeedModule } from '@database/seeds/role/role-seed.module';
import { DatabaseConfigModule } from '@core/utils/modules-set';

@Module({
  imports: [
    UserSeedModule,
    RoleSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getEnvFilePath()],
      load: [configuration],
    }),
    DatabaseConfigModule,
  ],
  providers: [],
  exports: [],
})
export class SeedModule {}
