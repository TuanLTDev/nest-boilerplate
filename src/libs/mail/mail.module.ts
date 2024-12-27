import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('mail.host', { infer: true }),
          port: config.get<number>('mail.port', { infer: true }),
          ignoreTLS: config.get('mail.ignoreTLS', { infer: true }),
          requireTLS: config.get('mail.requireTLS', { infer: true }),
          secure: config.get('mail.secure', { infer: true }),
          logger: false,
          auth: {
            user: config.get('mail.user', { infer: true }),
            pass: config.get('mail.password', { infer: true }),
          },
        },
        defaults: {
          from: `"${config.get('mail.defaultName', { infer: true })}" <${config.get('mail.defaultEmail', { infer: true })}>`,
        },
        template: {
          dir: join(__dirname, 'templates').replace('dist', 'src'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
