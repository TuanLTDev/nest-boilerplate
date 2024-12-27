import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath } from '@core/helper';
import configuration from '@/config/configuration';
import { DatabaseConfigModule } from '@/config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
import { RoleModule } from '@modules/role/role.module';
import { commands } from '@/commands';
import { PermissionModule } from '@modules/permission/permission.module';
import { SessionModule } from '@modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      load: [configuration],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseConfigModule,
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
      cookieOptions: {
        name: 'x-device_id',
        httpOnly: true,
      },
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...commands],
})
export class AppModule {}
