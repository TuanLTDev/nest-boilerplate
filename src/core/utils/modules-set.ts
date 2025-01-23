import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ModuleMetadata } from '@nestjs/common';
import databaseConfig from '@database/config/database.config';
import authConfig from '@modules/auth/config/auth.config';
import redisConfig from '@/libs/redis/config/redis.config';
import mailConfig from '@/libs/mail/config/mail.config';
import appConfig from '@config/app.config';
import { getEnvFilePath } from '@core/helper';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ScheduleModule } from '@nestjs/schedule';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
import swaggerConfig from '@config/swagger.config';
import { LoggerModule } from 'nestjs-pino';
import loggerFactory from '@core/utils/logger-factory';
import { AllConfigType } from '@config/config.type';

const getMongodbUri = (configService: ConfigService<AllConfigType>): MongooseModuleOptions => {
  const { scheme, host, username, password, port, databaseName, options } = configService.getOrThrow('database');
  const auth = username && password ? `${username}:${password}@` : '';
  const portPart = scheme !== 'mongodb+srv' && port ? `:${port}` : '';
  const optionsPart = options ? options : '';

  const uri = `${scheme}://${auth}${host}${portPart}/${databaseName ?? ''}${optionsPart}`;
  return {
    uri,
  };
};

export const DatabaseConfigModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: getMongodbUri,
  inject: [ConfigService],
});

function generateModulesSet() {
  const imports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, redisConfig, mailConfig, swaggerConfig],
      envFilePath: getEnvFilePath(),
    }),
  ];

  let customModules: ModuleMetadata['imports'] = [];
  const databaseModule = DatabaseConfigModule;

  const loggerModule = LoggerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: loggerFactory,
    inject: [ConfigService],
  });

  const cacheModule = CacheModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        store: await redisStore({
          host: configService.getOrThrow<string>('redis.host', { infer: true }),
          port: configService.getOrThrow<number>('redis.port', { infer: true }),
          password: configService.getOrThrow('redis.password', {
            infer: true,
          }),
          tls: configService.get('redis.tlsEnabled', { infer: true }),
        }),
      };
    },
    isGlobal: true,
    inject: [ConfigService],
  });

  const scheduleModule = ScheduleModule.forRoot();

  const fingerprintModule = NestjsFingerprintModule.forRoot({
    params: ['headers', 'userAgent', 'ipAddress'],
    cookieOptions: {
      name: 'x-device_id',
      httpOnly: true,
    },
  });

  customModules = [databaseModule, loggerModule, cacheModule, scheduleModule, fingerprintModule];

  return imports.concat(customModules);
}

export default generateModulesSet;
