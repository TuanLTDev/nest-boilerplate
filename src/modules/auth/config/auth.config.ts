import { registerAs } from '@nestjs/config';
import { AuthConfig } from '@modules/auth/config/auth-config.type';
import validateConfig from '@core/utils/validate-config';
import * as process from 'process';
import { IsString } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  console.info('Register AuthConfig from environment variables');
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    expires: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  } as AuthConfig;
});
