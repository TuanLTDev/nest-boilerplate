import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import redisConfig from '@/libs/redis/config/redis.config';
import { getEnvFilePath } from '@core/helper';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
      envFilePath: getEnvFilePath(),
    }),
    CacheModule.registerAsync({
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
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
