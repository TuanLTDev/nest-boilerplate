import { Module } from '@nestjs/common';
import { UserSeedModule } from '@database/seeds/user/user-seed.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath } from '@core/helper';
import { RoleSeedModule } from '@database/seeds/role/role-seed.module';
import { DatabaseConfigModule } from '@core/utils/modules-set';
import databaseConfig from '@database/config/database.config';
import appConfig from '@config/app.config';

@Module({
  imports: [
    UserSeedModule,
    RoleSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getEnvFilePath()],
      load: [databaseConfig, appConfig],
    }),
    DatabaseConfigModule,
  ],
  providers: [],
  exports: [],
})
export class SeedModule {}
