import { IsOptional, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import validateConfig from '@core/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  COMPANY_NAME: string;

  @IsString()
  @IsOptional()
  COMPANY_URL: string;

  @IsString()
  @IsOptional()
  COMPANY_EMAIL: string;
}

export default registerAs('swagger', () => {
  console.info('Register SwaggerConfig from environment variables');
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    name: process.env.COMPANY_NAME,
    url: process.env.COMPANY_URL,
    email: process.env.COMPANY_EMAIL,
  };
});
