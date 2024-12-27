import * as process from 'process';
import { Environment } from '@core/constants/app.constant';

export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || Environment.DEVELOPMENT,
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    clientUrl: process.env.APP_CLIENT_URL,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    debug: process.env.APP_DEBUG === 'true',
    apiPrefix: process.env.API_PREFIX || 'api',
    corsOrigin: process.env.APP_CORS_ORIGIN || '*',
    admobUrl: process.env.ADMOB_URL,
    admobAccessToken: process.env.ADMOB_ACCESS_TOKEN,
  },
  auth: {
    expires: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  },
  company: {
    name: process.env.COMPANY_NAME,
    url: process.env.COMPANY_URL,
    email: process.env.COMPANY_EMAIL,
  },
  database: {
    scheme: process.env.DATABASE_SCHEME || 'mongodb',
    host: process.env.DATABASE_HOST || 'localhost',
    username: process.env.DATABASE_USER_NAME,
    password: process.env.DATABASE_USER_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
    databaseName: process.env.DATABASE_NAME,
    options: process.env.DATABASE_OPTIONS,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
  },
});
