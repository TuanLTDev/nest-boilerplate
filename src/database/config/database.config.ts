import { DatabaseConfig } from '@database/config/database-config.type';
import { registerAs } from '@nestjs/config';
import validateConfig from '@core/utils/validate-config';
import { IsInt, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import * as process from 'process';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  DATABASE_SCHEME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USER_NAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USER_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @IsString()
  @IsOptional()
  DATABASE_OPTIONS: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  console.info('Register DatabaseConfig from environment variables');
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    scheme: process.env.DATABASE_SCHEME || 'mongodb',
    host: process.env.DATABASE_HOST || 'localhost',
    username: process.env.DATABASE_USER_NAME,
    password: process.env.DATABASE_USER_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
    databaseName: process.env.DATABASE_NAME,
    options: process.env.DATABASE_OPTIONS,
  };
});
