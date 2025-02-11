import { Environment, LogService } from '@core/constants/app.constant';
import validateConfig from '@core/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUrl, Matches, Max, Min } from 'class-validator';
import * as process from 'process';
import { AppConfig } from './app-config.type';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_URL: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_CLIENT_URL: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsBoolean()
  @IsOptional()
  APP_DEBUG: boolean;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_LOG_LEVEL: string;

  @IsString()
  @IsEnum(LogService)
  @IsOptional()
  APP_LOG_SERVICE: string;

  @IsString()
  @Matches(/^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/)
  @IsOptional()
  APP_CORS_ORIGIN: string;

  @IsString()
  @IsOptional()
  ADMOB_URL: string;

  @IsString()
  @IsOptional()
  ADMOB_ACCESS_TOKEN: string;
}

export default registerAs<AppConfig>('app', () => {
  console.info('Register AppConfig from environment variables');
  validateConfig(process.env, EnvironmentVariablesValidator);

  const port = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000;

  return {
    nodeEnv: process.env.NODE_ENV || Environment.DEVELOPMENT,
    name: process.env.APP_NAME || 'app',
    url: process.env.APP_URL || `http://localhost:${port}`,
    clientUrl: process.env.APP_CLIENT_URL,
    port,
    debug: process.env.APP_DEBUG === 'true',
    apiPrefix: process.env.API_PREFIX || 'api',
    logLevel: process.env.APP_LOG_LEVEL || 'warn',
    logService: process.env.APP_LOG_SERVICE || LogService.CONSOLE,
    corsOrigin: getCorsOrigin(),
    admobUrl: process.env.ADMOB_URL,
    admobAccessToken: process.env.ADMOB_ACCESS_TOKEN,
  } as AppConfig;
});

function getCorsOrigin() {
  const corsOrigin = process.env.APP_CORS_ORIGIN;
  if (corsOrigin === 'true') return true;
  if (corsOrigin === '*') return '*';
  if (!corsOrigin || corsOrigin === 'false') return false;

  return corsOrigin.split(',').map((origin) => origin.trim());
}
