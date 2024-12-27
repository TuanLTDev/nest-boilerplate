import { Module } from '@nestjs/common';
import { UserSeedModule } from '@database/seeds/user/user-seed.module';
import { DatabaseConfigModule } from '@config/database.config';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath } from '@core/helper';
import configuration from '@config/configuration';
import { RoleSeedModule } from '@database/seeds/role/role-seed.module';

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
