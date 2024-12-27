import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { RedisConfig } from '@/libs/redis/config/redis-config.type';
import validateConfig from '@core/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsBoolean()
  @IsOptional()
  REDIS_TLS_ENABLED: boolean;
}

export default registerAs<RedisConfig>('redis', () => {
  console.info('Register RedisConfig from environment variables');
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD,
    tlsEnabled: process.env.REDIS_TLS_ENABLED === 'true',
  };
});
