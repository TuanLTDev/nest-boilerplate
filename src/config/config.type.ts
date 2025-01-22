import { AppConfig } from '@config/app-config.type';
import { DatabaseConfig } from '@database/config/database-config.type';
import { AuthConfig } from '@modules/auth/config/auth-config.type';
import { MailConfig } from '@/libs/mail/config/mail-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mail: MailConfig;
};
